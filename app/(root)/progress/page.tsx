import Link from "next/link";
import { redirect } from "next/navigation";
import { TrendingUp, TrendingDown, Minus, Sparkles, Trophy, Flame, ListChecks } from "lucide-react";

import { Button } from "@/components/ui/button";
import StatCard from "@/components/StatCard";
import ProgressChart from "@/components/ProgressChart";
import CategoryBreakdown from "@/components/CategoryBreakdown";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
    getFeedbackByUserId,
    getInterviewsByUserId,
} from "@/lib/actions/general.action";
import { computeProgressStats } from "@/lib/utils";

import dayjs from "dayjs";

const TrendBadge = ({
                        trend,
                        delta,
                    }: {
    trend: "up" | "down" | "flat" | "new";
    delta: number;
}) => {
    if (trend === "new") return null;

    const config = {
        up: {
            icon: TrendingUp,
            text: `+${delta} pts vs last attempt`,
            className: "text-success-100 bg-success-100/10",
        },
        down: {
            icon: TrendingDown,
            text: `${delta} pts vs last attempt`,
            className: "text-destructive-100 bg-destructive-100/10",
        },
        flat: {
            icon: Minus,
            text: "Same as last attempt",
            className: "text-light-400 bg-white/5",
        },
    }[trend];

    const Icon = config.icon;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${config.className}`}
        >
      <Icon size={14} />
            {config.text}
    </span>
    );
};

const ProgressPage = async () => {
    const user = await getCurrentUser();
    if (!user || !user.id) redirect("/sign-in");

    const [feedbackList, interviews] = await Promise.all([
        getFeedbackByUserId(user.id),
        getInterviewsByUserId(user.id),
    ]);

    const interviewById = new Map((interviews ?? []).map((i) => [i.id, i]));

    const points: ProgressDataPoint[] = feedbackList.map((fb) => {
        const interview = interviewById.get(fb.interviewId);
        return {
            feedbackId: fb.id,
            interviewId: fb.interviewId,
            role: interview?.role ?? "Interview",
            type: interview?.type ?? "Mixed",
            totalScore: fb.totalScore,
            categoryScores: fb.categoryScores,
            createdAt: fb.createdAt,
        };
    });

    const stats = computeProgressStats(points);

    // Empty state — no completed interviews yet.
    if (stats.totalCompleted === 0) {
        return (
            <section className="flex flex-col gap-8 max-w-5xl mx-auto w-full">
                <h2>Your Progress</h2>
                <div className="card flex flex-col items-center gap-4 p-12 text-center">
                    <Sparkles className="text-primary-200" size={36} />
                    <h3>No interviews completed yet</h3>
                    <p className="text-light-400 max-w-md">
                        Take your first mock interview and your score history, strengths,
                        and growth trend will start showing up here.
                    </p>
                    <Button asChild className="btn-primary mt-2">
                        <Link href="/interview">Start an Interview</Link>
                    </Button>
                </div>
            </section>
        );
    }

    const chartData = points.map((p) => ({
        label: dayjs(p.createdAt).format("MMM D"),
        fullDate: p.createdAt,
        score: p.totalScore,
        role: p.role,
    }));

    return (
        <section className="flex flex-col gap-8 max-w-5xl mx-auto w-full">
            <div className="flex flex-col gap-2">
                <h2>Your Progress</h2>
                <p className="text-light-400">
                    {stats.totalCompleted} interview
                    {stats.totalCompleted === 1 ? "" : "s"} completed — here&apos;s how
                    you&apos;re trending.
                </p>
            </div>

            {/* Stat cards */}
            <div className="flex flex-wrap gap-4">
                <StatCard
                    label="Latest Score"
                    value={`${stats.latestScore}`}
                    accent="primary"
                    icon={<Sparkles size={16} className="text-primary-200" />}
                />
                <StatCard
                    label="Average Score"
                    value={`${stats.averageScore}`}
                    sublabel={`Across ${stats.totalCompleted} interview${stats.totalCompleted === 1 ? "" : "s"}`}
                    icon={<ListChecks size={16} className="text-light-400" />}
                />
                <StatCard
                    label="Best Score"
                    value={`${stats.bestScore}`}
                    accent="success"
                    icon={<Trophy size={16} className="text-success-100" />}
                />
                <StatCard
                    label="Current Streak"
                    value={`${stats.currentStreak}`}
                    sublabel={
                        stats.currentStreak > 1
                            ? "Non-decreasing attempts in a row"
                            : "Complete another to build a streak"
                    }
                    accent="success"
                    icon={<Flame size={16} className="text-success-100" />}
                />
            </div>

            {/* Score over time */}
            <div className="card p-6 flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3>Score Over Time</h3>
                    <TrendBadge trend={stats.trend} delta={stats.scoreDelta} />
                </div>
                <ProgressChart data={chartData} />
            </div>

            {/* Category breakdown */}
            <div className="card p-6 flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                    <h3>Skill Breakdown</h3>
                    <p className="text-light-400 text-sm">
                        Averaged across every interview you&apos;ve completed.
                    </p>
                </div>
                <CategoryBreakdown categories={stats.categoryAverages} />

                {stats.bestCategory && stats.weakestCategory && (
                    <div className="flex flex-wrap gap-3 pt-2 border-t border-white/5">
                        <p className="text-sm text-light-100">
                            <span className="text-success-100 font-semibold">Strongest:</span>{" "}
                            {stats.bestCategory.name} ({stats.bestCategory.avg}/100)
                        </p>
                        <span className="text-light-400">·</span>
                        <p className="text-sm text-light-100">
              <span className="text-primary-200 font-semibold">
                Focus area:
              </span>{" "}
                            {stats.weakestCategory.name} ({stats.weakestCategory.avg}/100)
                        </p>
                    </div>
                )}
            </div>

            <div className="flex justify-center pb-4">
                <Button asChild className="btn-primary">
                    <Link href="/interview">Take Another Interview</Link>
                </Button>
            </div>
        </section>
    );
};

export default ProgressPage;
