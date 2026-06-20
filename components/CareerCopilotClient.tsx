"use client";

import { useState } from "react";
import Link from "next/link";

interface EnrichedFeedback {
    id: string;
    interviewId: string;
    totalScore: number;
    role: string;
    techstack: string[];
    type: string;
    categoryScores: Array<{ name: string; score: number; comment: string }>;
    strengths: string[];
    areasForImprovement: string[];
    finalAssessment: string;
    createdAt: string;
}

interface Props {
    userName: string;
    latestFeedback: EnrichedFeedback | null;
    allFeedbacks: EnrichedFeedback[];
    avgScore: number;
}

function deriveSkillGaps(feedbacks: EnrichedFeedback[]): string[] {
    const gapCounts: Record<string, number> = {};
    feedbacks.forEach((fb) => {
        fb.areasForImprovement.forEach((area) => {
            const key = area.trim();
            gapCounts[key] = (gapCounts[key] ?? 0) + 1;
        });
    });
    return Object.entries(gapCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([gap]) => gap);
}

function generateRoadmap(gaps: string[], targetRole: string) {
    const days: Array<{ day: number; task: string; focus: string; done: boolean }> = [];
    const skills = gaps.length > 0 ? gaps : ["Communication", "Problem Solving", "System Design"];

    const phases = [
        { label: "Foundation", emoji: "📚" },
        { label: "Practice", emoji: "🔨" },
        { label: "Deep Dive", emoji: "🧠" },
        { label: "Mock & Review", emoji: "🎯" },
    ];

    for (let d = 1; d <= 14; d++) {
        const skillIndex = Math.floor(((d - 1) / 14) * skills.length);
        const skill = skills[Math.min(skillIndex, skills.length - 1)];
        const phase = phases[Math.floor((d - 1) / 3.5)];

        days.push({
            day: d,
            task: `${phase?.emoji ?? "📌"} ${phase?.label ?? "Study"}: ${skill}`,
            focus: skill,
            done: false,
        });
    }
    return days;
}

const LEVEL_LABELS = [
    { min: 0, max: 30, label: "Beginner", color: "#FF5F6D" },
    { min: 30, max: 55, label: "Developing", color: "#FFA040" },
    { min: 55, max: 75, label: "Intermediate", color: "#00D4FF" },
    { min: 75, max: 90, label: "Advanced", color: "#00FFA3" },
    { min: 90, max: 101, label: "Expert", color: "#A78BFA" },
];

function getLevelInfo(score: number) {
    return (
        LEVEL_LABELS.find((l) => score >= l.min && score < l.max) ??
        LEVEL_LABELS[LEVEL_LABELS.length - 1]
    );
}

export default function CareerCopilotClient({
                                                userName,
                                                latestFeedback,
                                                allFeedbacks,
                                                avgScore,
                                            }: Props) {
    const [targetRole, setTargetRole] = useState(
        latestFeedback?.role ?? "Frontend Developer"
    );
    const [editingRole, setEditingRole] = useState(false);
    const [roadmapOpen, setRoadmapOpen] = useState(false);
    const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());

    const levelInfo = getLevelInfo(avgScore);
    const skillGaps = deriveSkillGaps(allFeedbacks);
    const roadmap = generateRoadmap(skillGaps, targetRole);

    const categoryAverages =
        allFeedbacks.length > 0
            ? (() => {
                const totals: Record<string, { sum: number; count: number }> = {};
                allFeedbacks.forEach((fb) => {
                    fb.categoryScores.forEach(({ name, score }) => {
                        if (!totals[name]) totals[name] = { sum: 0, count: 0 };
                        totals[name].sum += score;
                        totals[name].count += 1;
                    });
                });
                return Object.entries(totals).map(([name, { sum, count }]) => ({
                    name,
                    avg: Math.round(sum / count),
                }));
            })()
            : [];

    const toggleDay = (day: number) => {
        setCompletedDays((prev) => {
            const next = new Set(prev);
            if (next.has(day)) next.delete(day);
            else next.add(day);
            return next;
        });
    };

    if (allFeedbacks.length === 0) {
        return (
            <div className="flex flex-col items-center gap-8 py-20">
                <div className="text-6xl">🎯</div>
                <div className="text-center max-w-lg">
                    <h2 className="text-3xl font-bold text-primary-100 mb-3">
                        Your AI Career Copilot
                    </h2>
                    <p className="text-light-400 mb-6">
                        Complete your first interview to unlock personalized coaching,
                        skill gap analysis, and a 14-day learning roadmap.
                    </p>
                    <Link href="/interview" className="btn-primary inline-block px-8 py-3 rounded-full font-bold text-dark-100">
                        Start First Interview
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 max-w-5xl mx-auto pb-16">

            {/* ── Upcoming Features Banner ── */}
            <div className="rounded-2xl border border-dashed border-amber-400/30 bg-amber-400/5 p-5">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold bg-amber-400/20 text-amber-400 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                        Upcoming in Copilot
                    </span>
                    <span className="text-xs text-light-400">
                        Features coming soon to supercharge your career
                    </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                        {
                            icon: "🧑‍💼",
                            title: "Live Mentor Sessions",
                            desc: "1-on-1 video coaching with industry experts",
                            eta: "Q3 2026",
                        },
                        {
                            icon: "📝",
                            title: "AI Resume Generation",
                            desc: "Auto-build an ATS-optimised resume from your history",
                            eta: "Q3 2026",
                        },
                        {
                            icon: "🏢",
                            title: "Company-Specific Prep",
                            desc: "Tailored question banks for Google, Amazon & more",
                            eta: "Q4 2026",
                        },
                    ].map((f) => (
                        <div
                            key={f.title}
                            className="flex items-start gap-3 bg-white/3 rounded-xl p-3"
                        >
                            <span className="text-xl">{f.icon}</span>
                            <div>
                                <p className="text-xs font-bold text-light-100">{f.title}</p>
                                <p className="text-[11px] text-light-400 mt-0.5">{f.desc}</p>
                                <span className="text-[10px] text-amber-400 font-semibold">
                                    {f.eta}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Header ── */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-primary-200 text-sm font-semibold tracking-wider uppercase">
                    <span>⚡</span>
                    <span>AI Career Copilot</span>
                </div>
                <h2 className="text-3xl font-bold text-primary-100">
                    Welcome back, {userName.split(" ")[0]}
                </h2>
                <p className="text-light-400">
                    Based on {allFeedbacks.length} interview{allFeedbacks.length > 1 ? "s" : ""} · Here&apos;s your personalised path to landing{" "}
                    <span className="text-primary-200 font-semibold">{targetRole}</span>
                </p>
            </div>

            {/* ── Top Row: Score Gauge + Target Role ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Current Level Card */}
                <div className="card p-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-light-400 uppercase tracking-wider">
                            Current Level
                        </span>
                        <span
                            className="text-xs font-bold px-3 py-1 rounded-full"
                            style={{
                                background: levelInfo.color + "22",
                                color: levelInfo.color,
                                border: `1px solid ${levelInfo.color}44`,
                            }}
                        >
                            {levelInfo.label}
                        </span>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <div className="relative w-40 h-24 overflow-hidden">
                            <svg viewBox="0 0 160 90" className="w-full h-full">
                                <path
                                    d="M 16 80 A 64 64 0 0 1 144 80"
                                    fill="none"
                                    stroke="rgba(255,255,255,0.07)"
                                    strokeWidth="12"
                                    strokeLinecap="round"
                                />
                                <path
                                    d="M 16 80 A 64 64 0 0 1 144 80"
                                    fill="none"
                                    stroke={levelInfo.color}
                                    strokeWidth="12"
                                    strokeLinecap="round"
                                    strokeDasharray={`${(avgScore / 100) * 201} 201`}
                                    style={{ filter: `drop-shadow(0 0 6px ${levelInfo.color}88)` }}
                                />
                                <text
                                    x="80"
                                    y="72"
                                    textAnchor="middle"
                                    fill="white"
                                    fontSize="22"
                                    fontWeight="bold"
                                >
                                    {avgScore}%
                                </text>
                            </svg>
                        </div>
                        <p className="text-xs text-light-400 text-center">
                            Average across {allFeedbacks.length} interview{allFeedbacks.length > 1 ? "s" : ""}
                        </p>
                    </div>

                    {allFeedbacks.length >= 2 && (() => {
                        const prev = allFeedbacks[allFeedbacks.length - 2].totalScore;
                        const curr = allFeedbacks[allFeedbacks.length - 1].totalScore;
                        const delta = curr - prev;
                        return (
                            <div
                                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
                                style={{
                                    background: delta >= 0 ? "#00FFA322" : "#FF5F6D22",
                                    color: delta >= 0 ? "#00FFA3" : "#FF5F6D",
                                }}
                            >
                                <span>{delta >= 0 ? "↑" : "↓"}</span>
                                <span>{Math.abs(delta)} pts from last interview</span>
                            </div>
                        );
                    })()}
                </div>

                {/* Target Role Card */}
                <div className="card p-6 flex flex-col gap-4">
                    <span className="text-sm font-semibold text-light-400 uppercase tracking-wider">
                        Target Role
                    </span>

                    {editingRole ? (
                        <div className="flex flex-col gap-3">
                            <input
                                className="bg-dark-300 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-primary-200"
                                value={targetRole}
                                onChange={(e) => setTargetRole(e.target.value)}
                                autoFocus
                            />
                            <button
                                onClick={() => setEditingRole(false)}
                                className="btn-primary text-sm rounded-full px-5 py-2 font-bold text-dark-100 self-start"
                            >
                                Set Goal
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                                    style={{ background: "rgba(0,212,255,0.12)" }}
                                >
                                    🎯
                                </div>
                                <div>
                                    <p className="font-bold text-white">{targetRole}</p>
                                    <p className="text-xs text-light-400">Your goal position</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setEditingRole(true)}
                                className="text-xs text-primary-200 border border-primary-200/30 rounded-full px-3 py-1 hover:bg-primary-200/10 transition-colors"
                            >
                                Change
                            </button>
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-xs text-light-400">
                            <span>Progress to readiness</span>
                            <span className="text-primary-200 font-semibold">{avgScore}/100</span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{
                                    width: `${avgScore}%`,
                                    background: `linear-gradient(90deg, #00D4FF, #00FFA3)`,
                                    boxShadow: "0 0 10px rgba(0,212,255,0.4)",
                                }}
                            />
                        </div>
                        <p className="text-xs text-light-400">
                            {avgScore >= 80
                                ? "🔥 You're very close to interview-ready!"
                                : avgScore >= 60
                                    ? "📈 Good progress — keep pushing!"
                                    : "💪 Strong foundation — focus on the gaps below"}
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Skill Gap Analysis ── */}
            <div className="card p-6 flex flex-col gap-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-white">Skill Gap Analysis</h3>
                        <p className="text-sm text-light-400 mt-0.5">
                            Areas identified across your interviews
                        </p>
                    </div>
                    <span className="text-xs text-light-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                        AI-Detected
                    </span>
                </div>

                {categoryAverages.length > 0 && (
                    <div className="flex flex-col gap-3">
                        {categoryAverages.map(({ name, avg }) => {
                            const isWeak = avg < 60;
                            const isMid = avg >= 60 && avg < 80;
                            const barColor = isWeak ? "#FF5F6D" : isMid ? "#FFA040" : "#00FFA3";
                            return (
                                <div key={name} className="flex flex-col gap-1.5">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-light-100">
                                                {name}
                                            </span>
                                            {isWeak && (
                                                <span className="text-xs text-destructive-100 bg-destructive-100/10 px-2 py-0.5 rounded-full border border-destructive-100/20">
                                                    Gap
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs font-bold" style={{ color: barColor }}>
                                            {avg}/100
                                        </span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-700"
                                            style={{
                                                width: `${avg}%`,
                                                background: barColor,
                                                boxShadow: `0 0 8px ${barColor}66`,
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {skillGaps.length > 0 && (
                    <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
                        <p className="text-xs text-light-400 font-semibold uppercase tracking-wider">
                            Top Improvement Areas
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {skillGaps.map((gap) => (
                                <span
                                    key={gap}
                                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border"
                                    style={{
                                        background: "rgba(255,95,109,0.08)",
                                        borderColor: "rgba(255,95,109,0.25)",
                                        color: "#FF9AA5",
                                    }}
                                >
                                    <span>✕</span>
                                    {gap}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ── 14-Day Roadmap ── */}
            <div className="card p-6 flex flex-col gap-5">
                <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setRoadmapOpen((o) => !o)}
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                            style={{ background: "rgba(167,139,250,0.15)" }}
                        >
                            🗓️
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">
                                AI-Generated 14-Day Roadmap
                            </h3>
                            <p className="text-sm text-light-400">
                                Personalised plan to close your gaps ·{" "}
                                <span className="text-primary-200">
                                    {completedDays.size}/14 completed
                                </span>
                            </p>
                        </div>
                    </div>
                    <span
                        className="text-light-400 text-lg transition-transform duration-200"
                        style={{ transform: roadmapOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                    >
                        ⌄
                    </span>
                </div>

                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                            width: `${(completedDays.size / 14) * 100}%`,
                            background: "linear-gradient(90deg, #A78BFA, #00D4FF)",
                        }}
                    />
                </div>

                {roadmapOpen && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        {roadmap.map(({ day, task, focus }) => {
                            const done = completedDays.has(day);
                            return (
                                <button
                                    key={day}
                                    onClick={() => toggleDay(day)}
                                    className="flex items-start gap-3 text-left p-4 rounded-xl border transition-all duration-200"
                                    style={{
                                        background: done ? "rgba(0,255,163,0.06)" : "rgba(255,255,255,0.03)",
                                        borderColor: done ? "rgba(0,255,163,0.25)" : "rgba(255,255,255,0.07)",
                                    }}
                                >
                                    <div
                                        className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                                        style={{
                                            background: done ? "rgba(0,255,163,0.2)" : "rgba(255,255,255,0.06)",
                                            color: done ? "#00FFA3" : "#8AA6C1",
                                            border: done ? "1px solid rgba(0,255,163,0.4)" : "1px solid rgba(255,255,255,0.1)",
                                        }}
                                    >
                                        {done ? "✓" : day}
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <span className={`text-sm font-medium ${done ? "line-through text-light-400" : "text-light-100"}`}>
                                            {task}
                                        </span>
                                        <span className="text-xs text-light-400">Focus: {focus}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── Strengths Snapshot ── */}
            {latestFeedback && latestFeedback.strengths.length > 0 && (
                <div className="card p-6 flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">💪</span>
                        <h3 className="text-xl font-bold text-white">Your Strengths</h3>
                        <span className="text-xs text-light-400 ml-auto">From latest interview</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {latestFeedback.strengths.map((s, i) => (
                            <span
                                key={i}
                                className="text-sm px-4 py-2 rounded-full"
                                style={{
                                    background: "rgba(0,255,163,0.08)",
                                    border: "1px solid rgba(0,255,163,0.2)",
                                    color: "#7DFFD4",
                                }}
                            >
                                ✓ {s}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* ── CTA ── */}
            <div
                className="rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
                style={{
                    background: "linear-gradient(135deg, rgba(0,212,255,0.08), rgba(0,255,163,0.08))",
                    border: "1px solid rgba(0,212,255,0.15)",
                }}
            >
                <div>
                    <p className="font-bold text-white text-lg">Ready to level up?</p>
                    <p className="text-sm text-light-400">
                        Practice another interview and watch your copilot update in real-time.
                    </p>
                </div>
                <div className="flex gap-3 flex-shrink-0">
                    <Link
                        href="/interview"
                        className="btn-primary text-sm rounded-full px-6 py-2.5 font-bold text-dark-100"
                    >
                        New Interview
                    </Link>
                    <Link
                        href="/progress"
                        className="btn-secondary text-sm rounded-full px-5 py-2.5 font-bold"
                    >
                        View Progress
                    </Link>
                </div>
            </div>
        </div>
    );
}