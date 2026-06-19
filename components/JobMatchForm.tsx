"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import JobMatchCard from "@/components/JobMatchCard";

const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(",")[1] ?? "");
        };
        reader.onerror = () => reject(new Error("Couldn't read that file."));
        reader.readAsDataURL(file);
    });

const JobMatchForm = ({ userId }: { userId: string }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<JobMatchResponse | null>(null);

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

            const response = await fetch("/api/jobs/match", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    resumeBase64,
                    mimeType: file.type || "application/pdf",
                    userid: userId,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setResult(data as JobMatchResponse);
                toast.success("Here's how your resume stacks up.");
            } else {
                toast.error(data.error || "Something went wrong matching your resume.");
            }
        } catch {
            toast.error("Something went wrong reading that resume. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 w-full">
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

                <Button
                    className="btn-primary w-full"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Analyzing your resume…" : "Find My Job Matches"}
                </Button>
            </div>

            {result && (
                <div className="flex flex-col gap-6">
                    <div className="card p-6 flex flex-col gap-2">
                        <p className="text-sm text-light-400">We read your resume as</p>
                        <h3 className="text-primary-100">
                            {result.profile.level} {result.profile.role}
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {result.profile.skills.slice(0, 12).map((skill) => (
                                <span
                                    key={skill}
                                    className="text-xs font-semibold px-3 py-1 rounded-full bg-dark-200 text-light-100 border border-input"
                                >
                  {skill}
                </span>
                            ))}
                        </div>
                    </div>

                    {!result.isPro && (
                        <div className="card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-primary-200/30">
                            <div>
                                <p className="font-semibold text-primary-100">
                                    Free plan: {result.matchesUsedToday}/{result.dailyLimit} job
                                    matches used today
                                </p>
                                <p className="text-sm text-light-400 mt-1">
                                    Upgrade to Pro for unlimited matches, missing-skill
                                    breakdowns, ATS score, resume optimization, and cover letter
                                    generation.
                                </p>
                            </div>
                            <Button className="btn-secondary shrink-0">
                                Upgrade to Pro — $5/mo
                            </Button>
                        </div>
                    )}

                    <div className="flex flex-col gap-4">
                        {result.matches.map((match) => (
                            <JobMatchCard key={match.jobId} match={match} isPro={result.isPro} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobMatchForm;
