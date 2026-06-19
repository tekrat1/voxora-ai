"use server";

import { generateObject } from "ai";
import { groq } from "@ai-sdk/groq";
import { z } from "zod";

import { db } from "@/firebase/admin";
import { getJobListings } from "@/constants/jobs";
import { FREE_DAILY_MATCH_LIMIT } from "@/lib/constants/job-limits";

// ---------------------------------------------------------------------------
// Plan limits
// ---------------------------------------------------------------------------
// Free plan: 4 job recommendations/day, basic match score only.
// Pro plan: unlimited matches + missing-skill breakdown + recommendation copy.
// Wire `isProUser` up to real billing (Stripe/Lemonsqueezy) later — for now
// it reads an optional `plan` field on the user's Firestore doc, defaulting
// everyone to "free".


async function isProUser(userId: string): Promise<boolean> {
    try {
        const snap = await db.collection("users").doc(userId).get();
        return snap.data()?.plan === "pro";
    } catch {
        return false;
    }
}

function todayKey() {
    return new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
}

async function getUsedToday(userId: string): Promise<number> {
    const docId = `${userId}_${todayKey()}`;
    const snap = await db.collection("jobMatchUsage").doc(docId).get();
    return snap.exists ? (snap.data()?.count ?? 0) : 0;
}

async function incrementUsedToday(userId: string, by: number) {
    const docId = `${userId}_${todayKey()}`;
    const ref = db.collection("jobMatchUsage").doc(docId);
    await db.runTransaction(async (tx) => {
        const snap = await tx.get(ref);
        const current = snap.exists ? (snap.data()?.count ?? 0) : 0;
        tx.set(
            ref,
            { userId, date: todayKey(), count: current + by },
            { merge: true }
        );
    });
}

// ---------------------------------------------------------------------------
// Resume -> profile extraction
// ---------------------------------------------------------------------------
const profileSchema = z.object({
    role: z.string(),
    level: z.string(),
    skills: z.array(z.string()),
    highlights: z.array(z.string()),
});

export async function extractResumeProfile(
    resumeText: string
): Promise<ResumeProfile> {
    const { object } = await generateObject({
        model: groq("llama-3.3-70b-versatile"),
        schema: profileSchema,
        prompt: `Read the resume text below and extract a structured profile.

RESUME TEXT:
"""
${resumeText}
"""

Return:
- role: the candidate's most likely target job title (specific, e.g. "Frontend Engineer").
- level: one of "Junior", "Mid", "Senior".
- skills: every real skill, language, framework, or tool actually mentioned in the resume (normalize casing, e.g. "React", "Node.js", "AWS", "Docker", "Python", "PostgreSQL").
- highlights: 3-6 short strings naming specific companies, projects, or achievements pulled directly from the resume.`,
        system:
            "You are an expert technical recruiter extracting structured candidate data from resume text. Only include skills that are explicitly present in the text.",
    });

    return object;
}

// ---------------------------------------------------------------------------
// Deterministic match scoring
// ---------------------------------------------------------------------------
// Scoring is computed in code (not by the LLM) so scores are consistent,
// explainable, and cheap to recompute — the LLM is only used once, upfront,
// to turn resume text into a skills list.
function normalizeSkill(skill: string): string {
    return skill.toLowerCase().trim().replace(/\.js$/, "");
}

function scoreJob(profileSkills: string[], job: JobListing): JobMatchResult {
    const profileSet = new Set(profileSkills.map(normalizeSkill));
    const required = job.requiredSkills;
    const niceToHave = job.niceToHaveSkills ?? [];

    const matchedRequired = required.filter((s) =>
        profileSet.has(normalizeSkill(s))
    );
    const matchedNice = niceToHave.filter((s) =>
        profileSet.has(normalizeSkill(s))
    );
    const missingSkills = required.filter(
        (s) => !profileSet.has(normalizeSkill(s))
    );

    // Required skills are worth most of the score; nice-to-haves add a bonus.
    const requiredWeight = required.length > 0 ? 80 / required.length : 0;
    const niceWeight = niceToHave.length > 0 ? 20 / niceToHave.length : 0;

    const matchScore = Math.round(
        Math.min(
            100,
            matchedRequired.length * requiredWeight + matchedNice.length * niceWeight
        )
    );

    const matchedSkills = [...matchedRequired, ...matchedNice];

    let recommendation: string;
    if (matchScore >= 85) recommendation = "Strong fit. Apply now.";
    else if (matchScore >= 65)
        recommendation = "Good fit — worth applying, brush up on the gaps below.";
    else if (matchScore >= 40)
        recommendation = "Partial fit. Consider building the missing skills first.";
    else recommendation = "Low fit for this role right now.";

    const reasoning =
        matchedSkills.length > 0
            ? `Matches on ${matchedSkills.slice(0, 4).join(", ")}${
                matchedSkills.length > 4 ? ", and more" : ""
            }.`
            : "No direct overlap with this role's core stack yet.";

    return {
        jobId: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        remote: job.remote,
        type: job.type,
        applyUrl: job.applyUrl,
        matchScore,
        matchedSkills,
        missingSkills,
        reasoning,
        recommendation,
    };
}

// ---------------------------------------------------------------------------
// Public entry point
// ---------------------------------------------------------------------------
export async function matchResumeToJobs(params: {
    userId: string;
    resumeText: string;
}): Promise<
    | { success: true; data: JobMatchResponse }
    | { success: false; error: string }
> {
    const { userId, resumeText } = params;

    try {
        const pro = await isProUser(userId);
        const usedToday = await getUsedToday(userId);

        if (!pro && usedToday >= FREE_DAILY_MATCH_LIMIT) {
            return {
                success: false,
                error: `You've used all ${FREE_DAILY_MATCH_LIMIT} free job matches for today. Upgrade to Pro for unlimited matches, or come back tomorrow.`,
            };
        }

        const profile = await extractResumeProfile(resumeText);

        const allScored = getJobListings()
            .map((job) => scoreJob(profile.skills, job))
            .sort((a, b) => b.matchScore - a.matchScore);

        // Free plan: only the top N recommendations per call, capped further by
        // the remaining daily allowance. Pro plan: full ranked list.
        const remainingToday = pro
            ? Infinity
            : Math.max(0, FREE_DAILY_MATCH_LIMIT - usedToday);

        const matches = pro
            ? allScored
            : allScored.slice(0, Math.min(remainingToday, FREE_DAILY_MATCH_LIMIT));

        // Free plan also gets a stripped-down basic score: hide the missing
        // skills / reasoning breakdown, which is a Pro perk.
        const finalMatches = pro
            ? matches
            : matches.map((m) => ({
                ...m,
                missingSkills: [],
                reasoning: "Upgrade to Pro to see exactly which skills you're missing.",
            }));

        await incrementUsedToday(userId, matches.length);

        return {
            success: true,
            data: {
                profile,
                matches: finalMatches,
                isPro: pro,
                dailyLimit: pro ? Infinity : FREE_DAILY_MATCH_LIMIT,
                matchesUsedToday: usedToday + matches.length,
                remainingToday: pro
                    ? Infinity
                    : Math.max(0, FREE_DAILY_MATCH_LIMIT - (usedToday + matches.length)),
            },
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Error matching resume to jobs:", error);
        return { success: false, error: message };
    }
}
