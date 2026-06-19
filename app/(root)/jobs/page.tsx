import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/actions/auth.action";
import JobMatchForm from "@/components/JobMatchForm";

const JobMatchPage = async () => {
    const user = await getCurrentUser();
    if (!user || !user.id) redirect("/sign-in");

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3 max-w-2xl">
                <h2>AI Resume → Job Match</h2>
                <p className="text-light-400">
                    Upload your resume and we&apos;ll match it against open roles —
                    showing your match score, the skills you already have, and what
                    you&apos;re missing for each one.
                </p>
            </div>

            <JobMatchForm userId={user.id} />
        </div>
    );
};

export default JobMatchPage;
