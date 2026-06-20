import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/actions/auth.action";
import JobMatchForm from "@/components/JobMatchForm";

const JobMatchPage = async () => {
    const user = await getCurrentUser();
    if (!user || !user.id) redirect("/sign-in");

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3 max-w-2xl">
                <div className="flex items-center gap-3 flex-wrap">
                    <h2>AI Resume → Job Match</h2>
                    <span className="text-xs font-bold bg-amber-400/20 text-amber-400 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                        Upcoming
                    </span>
                </div>
                <p className="text-light-400">
                    Upload your resume and we&apos;ll match it against open roles —
                    showing your match score, the skills you already have, and what
                    you&apos;re missing for each one.
                </p>
                <div className="rounded-xl border border-dashed border-amber-400/30 bg-amber-400/5 p-4 flex items-start gap-3">
                    <span className="text-xl">🚀</span>
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-semibold text-amber-300">Coming in Q3 2026</p>
                        <p className="text-xs text-light-400">
                            We&apos;re building a smarter job-matching engine that analyses your resume, maps your skills to live job postings, and surfaces your top matches with detailed gap analysis. Stay tuned!
                        </p>
                    </div>
                </div>
            </div>

            <JobMatchForm userId={user.id} />
        </div>
    );
};

export default JobMatchPage;