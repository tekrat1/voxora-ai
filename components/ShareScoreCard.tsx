"use client";

import { useRef, useState } from "react";

interface CategoryScore {
    name: string;
    score: number;
    comment: string;
}

interface ShareScoreCardProps {
    role: string;
    totalScore: number;
    categoryScores: CategoryScore[];
    strengths: string[];
}

// Score → label + color mapping
function getScoreLabel(score: number) {
    if (score >= 90) return { label: "Exceptional", color: "#00E676" };
    if (score >= 75) return { label: "Strong", color: "#00D4FF" };
    if (score >= 60) return { label: "Solid", color: "#8AA6C1" };
    return { label: "Developing", color: "#FF5F6D" };
}

// Circular arc for the donut score indicator
function ScoreArc({ score }: { score: number }) {
    const radius = 54;
    const cx = 64;
    const cy = 64;
    const circumference = 2 * Math.PI * radius;
    const filled = (score / 100) * circumference;
    const { color } = getScoreLabel(score);

    return (
        <svg width="128" height="128" viewBox="0 0 128 128" fill="none">
            {/* Track */}
            <circle cx={cx} cy={cy} r={radius} stroke="#1F2B38" strokeWidth="10" fill="none" />
            {/* Progress */}
            <circle
                cx={cx}
                cy={cy}
                r={radius}
                stroke={color}
                strokeWidth="10"
                fill="none"
                strokeDasharray={`${filled} ${circumference - filled}`}
                strokeDashoffset={circumference * 0.25}
                strokeLinecap="round"
                style={{ transition: "stroke-dasharray 0.6s ease" }}
            />
            {/* Score text */}
            <text x={cx} y={cy - 6} textAnchor="middle" fill="white" fontSize="22" fontWeight="700" fontFamily="Mona Sans, sans-serif">
                {score}
            </text>
            <text x={cx} y={cy + 14} textAnchor="middle" fill="#8AA6C1" fontSize="11" fontFamily="Mona Sans, sans-serif">
                / 100
            </text>
        </svg>
    );
}

// Mini bar for category scores
function MiniBar({ score, color }: { score: number; color: string }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
            <div
                style={{
                    flex: 1,
                    height: "5px",
                    background: "#1F2B38",
                    borderRadius: "3px",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        width: `${score}%`,
                        height: "100%",
                        background: color,
                        borderRadius: "3px",
                    }}
                />
            </div>
            <span style={{ color: "#8AA6C1", fontSize: "11px", minWidth: "26px", textAlign: "right" }}>
        {score}
      </span>
        </div>
    );
}

// The card design — rendered in DOM, screenshot-able
function ScoreCardVisual({
                             role,
                             totalScore,
                             categoryScores,
                             strengths,
                         }: ShareScoreCardProps) {
    const { label, color } = getScoreLabel(totalScore);

    // Short category names for the card
    const shortNames: Record<string, string> = {
        "Communication Skills": "Communication",
        "Technical Knowledge": "Technical",
        "Problem-Solving": "Problem Solving",
        "Cultural & Role Fit": "Role Fit",
        "Confidence & Clarity": "Confidence",
    };

    return (
        <div
            style={{
                width: "520px",
                background: "linear-gradient(135deg, #0B1220 0%, #050B14 100%)",
                borderRadius: "20px",
                padding: "36px",
                fontFamily: "Mona Sans, system-ui, sans-serif",
                color: "white",
                border: "1px solid rgba(0,212,255,0.15)",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Ambient glow */}
            <div
                style={{
                    position: "absolute",
                    top: "-60px",
                    right: "-60px",
                    width: "200px",
                    height: "200px",
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${color}22 0%, transparent 70%)`,
                    pointerEvents: "none",
                }}
            />

            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                <div>
                    <div style={{ fontSize: "11px", letterSpacing: "0.12em", color: "#8AA6C1", textTransform: "uppercase", marginBottom: "6px" }}>
                        Mock Interview Result
                    </div>
                    <div style={{ fontSize: "22px", fontWeight: "700", textTransform: "capitalize", lineHeight: 1.2 }}>
                        {role} Interview
                    </div>
                    <div
                        style={{
                            display: "inline-block",
                            marginTop: "8px",
                            padding: "3px 10px",
                            borderRadius: "20px",
                            background: `${color}22`,
                            border: `1px solid ${color}55`,
                            color: color,
                            fontSize: "12px",
                            fontWeight: "600",
                        }}
                    >
                        {label}
                    </div>
                </div>
                <ScoreArc score={totalScore} />
            </div>

            {/* Divider */}
            <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", marginBottom: "20px" }} />

            {/* Category Scores */}
            <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "11px", color: "#5B728A", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>
                    Category Breakdown
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {categoryScores.map((cat, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div style={{ width: "110px", fontSize: "12px", color: "#8AA6C1", flexShrink: 0 }}>
                                {shortNames[cat.name] ?? cat.name}
                            </div>
                            <MiniBar score={cat.score} color={color} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Divider */}
            <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", marginBottom: "20px" }} />

            {/* Top strength */}
            {strengths.length > 0 && (
                <div style={{ marginBottom: "24px" }}>
                    <div style={{ fontSize: "11px", color: "#5B728A", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>
                        Top Strength
                    </div>
                    <div style={{ fontSize: "13px", color: "#E6FBFF", lineHeight: 1.5, fontStyle: "italic" }}>
                        "{strengths[0]}"
                    </div>
                </div>
            )}

            {/* Footer */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 16px",
                    background: "rgba(0,212,255,0.06)",
                    borderRadius: "10px",
                    border: "1px solid rgba(0,212,255,0.12)",
                }}
            >
                <div>
                    <div style={{ fontSize: "13px", fontWeight: "700", color: "#00D4FF" }}>Voxora AI</div>
                    <div style={{ fontSize: "11px", color: "#5B728A" }}>voxora.ai · Practice smarter</div>
                </div>
                <div style={{ fontSize: "11px", color: "#5B728A", textAlign: "right" }}>
                    AI-powered<br />mock interviews
                </div>
            </div>
        </div>
    );
}

export default function ShareScoreCard(props: ShareScoreCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [copied, setCopied] = useState(false);
    const [sharing, setSharing] = useState(false);

    const { totalScore, role } = props;
    const { label } = getScoreLabel(totalScore);

    // LinkedIn share text
    const linkedInText = `🎯 Just completed an AI mock interview on Voxora!\n\nRole: ${role.charAt(0).toUpperCase() + role.slice(1)}\nScore: ${totalScore}/100 — ${label}\n\nVoxora gives real-time AI feedback on your communication, technical knowledge, problem-solving, and more. It's the most realistic mock interview practice I've found.\n\nTry it free 👇\nhttps://voxora.ai\n\n#JobSearch #InterviewPrep #CareerGrowth #TechJobs`;

    const handleCopyText = async () => {
        await navigator.clipboard.writeText(linkedInText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    const handleShareLinkedIn = () => {
        setSharing(true);
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://voxora.ai")}&summary=${encodeURIComponent(linkedInText)}`;
        window.open(url, "_blank", "noopener,noreferrer");
        setTimeout(() => setSharing(false), 1500);
    };

    const handleShareTwitter = () => {
        const tweetText = `Just scored ${totalScore}/100 on my ${role} mock interview on @VoxoraAI! ${label} performance 🎯\n\nPractice your interview skills with AI feedback → voxora.ai\n\n#InterviewPrep #TechJobs`;
        window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`,
            "_blank",
            "noopener,noreferrer"
        );
    };

    return (
        <div className="flex flex-col gap-6 items-center w-full">
            {/* Section header */}
            <div className="flex flex-col gap-1 items-center text-center">
                <h3 className="text-lg font-semibold text-white">Share Your Result</h3>
                <p className="text-sm" style={{ color: "#5B728A" }}>
                    Post your score — inspire others to level up their interview game.
                </p>
            </div>

            {/* The shareable card */}
            <div
                ref={cardRef}
                style={{ borderRadius: "20px", overflow: "hidden" }}
                className="max-w-full"
            >
                <div style={{ transform: "scale(1)", transformOrigin: "top center" }}>
                    <ScoreCardVisual {...props} />
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 justify-center">
                {/* LinkedIn — primary CTA */}
                <button
                    onClick={handleShareLinkedIn}
                    disabled={sharing}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "10px 20px",
                        background: "#0A66C2",
                        border: "none",
                        borderRadius: "10px",
                        color: "white",
                        fontWeight: "600",
                        fontSize: "14px",
                        cursor: "pointer",
                        opacity: sharing ? 0.7 : 1,
                        transition: "opacity 0.2s",
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    {sharing ? "Opening…" : "Post to LinkedIn"}
                </button>

                {/* Copy post text */}
                <button
                    onClick={handleCopyText}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "10px 20px",
                        background: copied ? "rgba(0,230,118,0.15)" : "rgba(0,212,255,0.1)",
                        border: `1px solid ${copied ? "rgba(0,230,118,0.4)" : "rgba(0,212,255,0.25)"}`,
                        borderRadius: "10px",
                        color: copied ? "#00E676" : "#00D4FF",
                        fontWeight: "600",
                        fontSize: "14px",
                        cursor: "pointer",
                        transition: "all 0.2s",
                    }}
                >
                    {copied ? (
                        <>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Copied!
                        </>
                    ) : (
                        <>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                            Copy Post Text
                        </>
                    )}
                </button>

                {/* X / Twitter */}
                <button
                    onClick={handleShareTwitter}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "10px 20px",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: "10px",
                        color: "#8AA6C1",
                        fontWeight: "600",
                        fontSize: "14px",
                        cursor: "pointer",
                    }}
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.632 5.905-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    Post on X
                </button>
            </div>

            {/* Subtle hint */}
            <p style={{ fontSize: "11px", color: "#5B728A", textAlign: "center" }}>
                Take a screenshot of the card above to include as an image in your post.
            </p>
        </div>
    );
}