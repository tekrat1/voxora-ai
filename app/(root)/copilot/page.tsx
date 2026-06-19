import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getFeedbackByUserId } from "@/lib/actions/general.action";
import { getInterviewsByUserId } from "@/lib/actions/general.action";
import CareerCopilotClient from "@/components/CareerCopilotClient";

const CopilotPage = async () => {
    const user = await getCurrentUser();
    if (!user) redirect("/sign-in");

    const [feedbacks, interviews] = await Promise.all([
        getFeedbackByUserId(user.id),
        getInterviewsByUserId(user.id),
    ]);

    // Build enriched data: merge feedback with interview role info
    const enrichedFeedbacks = (feedbacks ?? []).map((fb) => {
        const interview = (interviews ?? []).find(
            (iv) => iv.id === fb.interviewId
        );
        return {
            ...fb,
            role: interview?.role ?? "Unknown Role",
            techstack: interview?.techstack ?? [],
            type: interview?.type ?? "mixed",
        };
    });

    const latestFeedback = enrichedFeedbacks[enrichedFeedbacks.length - 1] ?? null;
    const avgScore =
        enrichedFeedbacks.length > 0
            ? Math.round(
                enrichedFeedbacks.reduce((s, f) => s + f.totalScore, 0) /
                enrichedFeedbacks.length
            )
            : 0;

    return (
        <CareerCopilotClient
            userName={user.name}
            latestFeedback={latestFeedback}
            allFeedbacks={enrichedFeedbacks}
            avgScore={avgScore}
        />
    );
};

export default CopilotPage;
