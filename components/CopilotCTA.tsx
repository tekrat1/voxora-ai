"use client";

import Link from "next/link";

interface Props {
    totalScore: number;
    role: string;
    areasForImprovement: string[];
}

export default function CopilotCTA({ totalScore, role, areasForImprovement }: Props) {
    const topGaps = areasForImprovement.slice(0, 3);
    const scoreColor =
        totalScore >= 80 ? "#00FFA3" : totalScore >= 60 ? "#00D4FF" : "#FF5F6D";
    const scoreLabel =
        totalScore >= 80 ? "Strong performance" : totalScore >= 60 ? "Good progress" : "Room to grow";

    return (
        <div
            className="rounded-2xl p-6 flex flex-col gap-5"
            style={{
                background: "linear-gradient(135deg, rgba(0,11,20,0.8), rgba(5,20,35,0.9))",
                border: "1px solid rgba(0,212,255,0.2)",
                boxShadow: "0 0 40px rgba(0,212,255,0.06)",
            }}
        >
            {/* Header */}
            <div className="flex items-center gap-3">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                    style={{ background: "rgba(0,212,255,0.12)", border: "1px solid rgba(0,212,255,0.2)" }}
                >
                    ⚡
                </div>
                <div>
                    <p className="font-bold text-white text-base">AI Career Copilot</p>
                    <p className="text-xs text-light-400">Your personalised coaching summary</p>
                </div>
                <span
                    className="ml-auto text-xs font-bold px-3 py-1 rounded-full shrink-0"
                    style={{
                        background: scoreColor + "18",
                        color: scoreColor,
                        border: `1px solid ${scoreColor}33`,
                    }}
                >
                    {scoreLabel}
                </span>
            </div>

            <hr style={{ borderColor: "rgba(255,255,255,0.06)" }} />

            {/* Score + Gaps side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Score block */}
                <div className="flex flex-col gap-2">
                    <p className="text-xs text-light-400 uppercase tracking-wider font-semibold">
                        Current Level
                    </p>
                    <div className="flex items-end gap-2">
                        <span
                            className="text-5xl font-black"
                            style={{ color: scoreColor, filter: `drop-shadow(0 0 12px ${scoreColor}66)` }}
                        >
                            {totalScore}%
                        </span>
                        <span className="text-light-400 text-sm mb-1">/ 100</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full"
                            style={{
                                width: `${totalScore}%`,
                                background: scoreColor,
                                boxShadow: `0 0 8px ${scoreColor}88`,
                            }}
                        />
                    </div>
                    <p className="text-xs text-light-400">
                        Target: <span className="text-white font-semibold capitalize">{role}</span>
                    </p>
                </div>

                {/* Gap Analysis */}
                <div className="flex flex-col gap-2">
                    <p className="text-xs text-light-400 uppercase tracking-wider font-semibold">
                        Gap Analysis
                    </p>
                    {topGaps.length > 0 ? (
                        <div className="flex flex-col gap-2">
                            {topGaps.map((gap, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-2 text-sm"
                                    style={{ color: "#FF9AA5" }}
                                >
                                    <span
                                        className="w-4 h-4 rounded-full flex items-center justify-center text-xs shrink-0"
                                        style={{
                                            background: "rgba(255,95,109,0.15)",
                                            border: "1px solid rgba(255,95,109,0.3)",
                                        }}
                                    >
                                        ✕
                                    </span>
                                    <span className="truncate">{gap}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-light-400">No major gaps identified 🎉</p>
                    )}
                </div>
            </div>

            {/* Roadmap teaser */}
            <div
                className="rounded-xl px-4 py-3 flex items-center justify-between gap-3"
                style={{ background: "rgba(167,139,250,0.07)", border: "1px solid rgba(167,139,250,0.15)" }}
            >
                <div className="flex items-center gap-2">
                    <span>🗓️</span>
                    <p className="text-sm text-light-100">
                        <span className="font-semibold text-white">AI-Generated 14-Day Roadmap</span>
                        {" "}ready to master your gaps
                    </p>
                </div>
                <Link
                    href="/copilot"
                    className="shrink-0 text-xs font-bold px-4 py-2 rounded-full transition-all"
                    style={{
                        background: "linear-gradient(135deg, #00D4FF, #00FFA3)",
                        color: "#050B14",
                    }}
                >
                    View Roadmap →
                </Link>
            </div>
        </div>
    );
}
