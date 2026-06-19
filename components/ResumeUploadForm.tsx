"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            // Strip the "data:application/pdf;base64," prefix — the API only
            // needs the raw base64 payload.
            resolve(result.split(",")[1] ?? "");
        };
        reader.onerror = () => reject(new Error("Couldn't read that file."));
        reader.readAsDataURL(file);
    });

const ResumeUploadForm = ({ userId }: { userId: string }) => {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

    const [file, setFile] = useState<File | null>(null);
    const [type, setType] = useState<"Technical" | "Behavioral" | "Mixed">(
        "Mixed"
    );
    const [amount, setAmount] = useState(5);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (selected: File | null) => {
        if (!selected) return;

        const isPdf =
            selected.type === "application/pdf" ||
            selected.name.toLowerCase().endsWith(".pdf");

        if (!isPdf) {
            toast.error("Please upload a PDF resume.");
            return;
        }

        if (selected.size > 8 * 1024 * 1024) {
            toast.error("That file is too large — please keep it under 8MB.");
            return;
        }

        setFile(selected);
    };

    const handleSubmit = async () => {
        if (!file) {
            toast.error("Please attach your resume first.");
            return;
        }

        setIsSubmitting(true);

        try {
            const resumeBase64 = await fileToBase64(file);

            const response = await fetch("/api/vapi/generate-from-resume", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    resumeBase64,
                    mimeType: file.type || "application/pdf",
                    type,
                    amount,
                    userid: userId,
                }),
            });

            const data = await response.json();

            if (data.success && data.interviewId) {
                toast.success("Your personalized interview is ready!");
                router.push(`/interview/${data.interviewId}`);
            } else {
                toast.error(data.error || "Something went wrong generating your interview.");
            }
        } catch {
            toast.error("Something went wrong reading that resume. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="card flex flex-col gap-6 p-8 max-w-xl w-full">
            <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                    e.preventDefault();
                    handleFileChange(e.dataTransfer.files?.[0] ?? null);
                }}
                onClick={() => inputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-3 border border-dashed border-input rounded-2xl p-10 cursor-pointer hover:border-primary-200/60 transition-colors"
            >
                <Image src="/upload.svg" alt="" width={32} height={32} />
                {file ? (
                    <p className="text-sm font-semibold text-primary-200">{file.name}</p>
                ) : (
                    <>
                        <p className="text-sm font-semibold text-light-100">
                            Click to upload, or drag your resume here
                        </p>
                        <p className="text-xs text-light-400">PDF only, up to 8MB</p>
                    </>
                )}
                <input
                    ref={inputRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                />
            </div>

            <div className="flex flex-col gap-3">
                <p className="label text-light-100">Interview focus</p>
                <div className="flex gap-2 flex-wrap">
                    {(["Technical", "Behavioral", "Mixed"] as const).map((opt) => (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => setType(opt)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                                type === opt
                                    ? "bg-primary-200 text-dark-100 border-primary-200"
                                    : "bg-dark-200 text-light-100 border-input"
                            }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <p className="label text-light-100">Number of questions</p>
                <div className="flex gap-2">
                    {[3, 5, 7, 10].map((n) => (
                        <button
                            key={n}
                            type="button"
                            onClick={() => setAmount(n)}
                            className={`size-10 rounded-full text-sm font-semibold border transition-colors ${
                                amount === n
                                    ? "bg-primary-200 text-dark-100 border-primary-200"
                                    : "bg-dark-200 text-light-100 border-input"
                            }`}
                        >
                            {n}
                        </button>
                    ))}
                </div>
            </div>

            <Button
                className="btn-primary w-full"
                onClick={handleSubmit}
                disabled={isSubmitting}
            >
                {isSubmitting ? "Reading your resume…" : "Generate My Interview"}
            </Button>
        </div>
    );
};

export default ResumeUploadForm;
