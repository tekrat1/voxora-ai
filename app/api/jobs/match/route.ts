import pdfParse from "pdf-parse";

import { matchResumeToJobs } from "@/lib/actions/job.action";

export async function POST(request: Request) {
    const {
        resumeBase64,
        mimeType,
        userid,
    }: {
        resumeBase64: string;
        mimeType: string;
        userid: string;
    } = await request.json();

    try {
        if (!resumeBase64) {
            return Response.json(
                { success: false, error: "No resume file was provided." },
                { status: 400 }
            );
        }

        if (!userid) {
            return Response.json(
                { success: false, error: "Missing user." },
                { status: 401 }
            );
        }

        if (mimeType && mimeType !== "application/pdf") {
            return Response.json(
                { success: false, error: "Only PDF resumes are supported right now." },
                { status: 400 }
            );
        }

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

        const MAX_RESUME_CHARS = 12000;
        if (resumeText.length > MAX_RESUME_CHARS) {
            resumeText = resumeText.slice(0, MAX_RESUME_CHARS);
        }

        const result = await matchResumeToJobs({ userId: userid, resumeText });

        if (!result.success) {
            return Response.json(
                { success: false, error: result.error },
                { status: 429 }
            );
        }

        return Response.json(
            { success: true, ...result.data },
            { status: 200 }
        );
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Error matching resume to jobs:", error);
        return Response.json(
            { success: false, error: `Couldn't match that resume: ${message}` },
            { status: 500 }
        );
    }
}
