import { generateText } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

// Gemini can read PDF/image files natively as part of a multimodal message,
// so we don't need a separate PDF-parsing dependency — we just hand the
// resume bytes straight to the model along with instructions.
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

        const { text: raw } = await generateText({
            model: google("gemini-2.0-flash-001"),
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "file" as const,
                            data: resumeBase64,
                            mimeType: mimeType || "application/pdf",
                        },
                        {
                            type: "text" as const,
                            text: `You are an expert technical recruiter. Read the attached resume carefully.

From it, infer:
- The candidate's most likely target job role (be specific, e.g. "Senior Frontend Engineer").
- Their seniority level: one of "Junior", "Mid", or "Senior".
- A short list of the real technologies/tools/languages found on the resume (techstack).
- 3-6 short highlight strings naming specific companies, projects, or achievements pulled directly from the resume (resumeHighlights) — these are shown back to the candidate so they must be accurate and specific, not generic.

Then generate ${amount} interview questions personalized to THIS resume — reference the candidate's actual past projects, companies, and technologies by name wherever natural, instead of asking generic questions a stranger could answer. The focus between behavioural and technical questions should lean towards: ${type}.

Do not use "/" or "*" or other special characters that could break a voice assistant reading the questions aloud.

Respond with ONLY raw JSON, no markdown fences, in exactly this shape:
{
  "role": "string",
  "level": "Junior | Mid | Senior",
  "techstack": ["string", "string"],
  "resumeHighlights": ["string", "string"],
  "questions": ["string", "string"]
}`,
                        },
                    ],
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