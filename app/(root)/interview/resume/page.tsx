import { redirect } from "next/navigation";

import ResumeUploadForm from "@/components/ResumeUploadForm";
import { getCurrentUser } from "@/lib/actions/auth.action";

const ResumeInterviewPage = async () => {
    const user = await getCurrentUser();
    if (!user || !user.id) redirect("/sign-in");

    return (
        <section className="flex flex-col items-center gap-8 max-w-5xl mx-auto w-full">
            <div className="flex flex-col items-center gap-2 text-center">
                <h2>Interview, Built From Your Resume</h2>
                <p className="text-light-400 max-w-md">
                    Upload your resume and we&apos;ll generate questions around your
                    actual experience — your projects, your stack, your story.
                </p>
            </div>

            <ResumeUploadForm userId={user.id} />
        </section>
    );
};

export default ResumeInterviewPage;
