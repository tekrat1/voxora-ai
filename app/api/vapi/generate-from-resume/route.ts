import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";
import pdfParse from "pdf-parse";

import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

// Groq's models don't accept raw PDF/file bytes the way Gemini did, so we
// extract the resume's text ourselves first (via pdf-parse) and then send
// plain text to the model along with instructions.
export async function POST(request: Request) {
    const {
        resumeBase64,
        mimeType,
        type,
        amount,
        userid,
    }: {
        resumeBase64: string;
        mimeType: string;
        type: string;
        amount: number;
        userid: string;
    } = await request.json();

    try {
        if (!resumeBase64) {
            return Response.json(
                { success: false, error: "No resume file was provided." },
                { status: 400 }
            );
        }

        if (mimeType && mimeType !== "application/pdf") {
            return Response.json(
                {
                    success: false,
                    error: "Only PDF resumes are supported right now.",
                },
                { status: 400 }
            );
        }

        // Decode the base64 PDF and pull out its text content.
        const pdfBuffer = Buffer.from(resumeBase64, "base64");
        let resumeText: string;
        try {
            const parsed = await pdfParse(pdfBuffer);
            resumeText = parsed.text?.trim() ?? "";
        } catch (parseError) {
            console.error("Failed to parse resume PDF:", parseError);
            return Response.json(
                {
                    success: false,
                    error:
                        "Couldn't read that PDF. Make sure it's a valid, text-based resume (not a scanned image).",
                },
                { status: 400 }
            );
        }

        if (!resumeText || resumeText.length < 50) {
            return Response.json(
                {
                    success: false,
                    error:
                        "Couldn't extract enough text from that resume. It may be a scanned image rather than a text-based PDF.",
                },
                { status: 400 }
            );
        }

        // Groq's free tier caps tokens-per-minute (~6-12K for this model), so
        // trim very long resumes to stay comfortably within that budget.
        const MAX_RESUME_CHARS = 12000;
        if (resumeText.length > MAX_RESUME_CHARS) {
            resumeText = resumeText.slice(0, MAX_RESUME_CHARS);
        }

        const { text: raw } = await generateText({
            model: groq("llama-3.3-70b-versatile"),
            messages: [
                {
                    role: "user",
                    content: `You are an expert technical recruiter. Read the resume text below carefully.

RESUME TEXT:
"""
${resumeText}
"""

From it, infer:
- The candidate's most likely target job role (be specific, e.g. "Senior Frontend Engineer").
- Their seniority level: one of "Junior", "Mid", or "Senior".
- A short list of the real technologies/tools/languages found on the resume (techstack).
- 3-6 short highlight strings naming specific companies, projects, or achievements pulled directly from the resume (resumeHighlights) — these are shown back to the candidate so they must be accurate and specific, not generic.

Then generate ${amount} interview questions personalized to THIS resume — reference the candidate's actual past projects, companies, and technologies by name wherever natural, instead of asking generic questions a stranger could answer. The focus between behavioural and technical questions should lean towards: ${type}.

Do not use "/" or "*" or other special characters that could break a voice assistant reading the questions aloud.

Respond with ONLY raw JSON, no markdown fences, no commentary, in exactly this shape:
{
  "role": "string",
  "level": "Junior | Mid | Senior",
  "techstack": ["string", "string"],
  "resumeHighlights": ["string", "string"],
  "questions": ["string", "string"]
}`,
                },
            ],
        });

        const cleaned = raw
            .trim()
            .replace(/^```(?:json)?\s*/i, "")
            .replace(/```\s*$/i, "")
            .trim();

        let parsed;
        try {
            parsed = JSON.parse(cleaned);
        } catch {
            console.error("Model did not return valid JSON. Raw output was:\n", raw);
            return Response.json(
                {
                    success: false,
                    error:
                        "The AI couldn't extract structured data from that resume. Try a different PDF, or one with more text content.",
                },
                { status: 500 }
            );
        }

        const interview = {
            role: parsed.role,
            type,
            level: parsed.level,
            techstack: parsed.techstack ?? [],
            questions: parsed.questions ?? [],
            resumeHighlights: parsed.resumeHighlights ?? [],
            source: "resume",
            userId: userid,
            finalized: true,
            coverImage: getRandomInterviewCover(),
            createdAt: new Date().toISOString(),
        };

        const docRef = await db.collection("interviews").add(interview);

        return Response.json(
            { success: true, interviewId: docRef.id },
            { status: 200 }
        );
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Error generating interview from resume:", error);
        return Response.json(
            {
                success: false,
                error: `Couldn't generate that interview: ${message}`,
            },
            { status: 500 }
        );
    }
}