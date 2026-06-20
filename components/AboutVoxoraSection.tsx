"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
    FileText,
    BarChart3,
    Zap,
    Mic,
    ShieldCheck,
    Sparkles,
    Share2,
    Briefcase,
    Bell,
    Users,
    LineChart,
    ChevronDown,
    ArrowRight,
} from "lucide-react";

const builtFeatures = [
    {
        icon: Mic,
        title: "AI Mock Interviews",
        desc: "Voice-driven interview simulations powered by Vapi AI, with custom question generation tailored to a role, level, and tech stack.",
        color: "#00D4FF",
    },
    {
        icon: Sparkles,
        title: "Real-Time Feedback",
        desc: "Every session is scored across communication, technical depth, and problem solving — with actionable, instant feedback after each call.",
        color: "#00FFA3",
    },
    {
        icon: FileText,
        title: "Resume → Job Match",
        desc: "Upload a resume and let the AI parse it, then surface job openings that actually fit your skills and experience.",
        color: "#A78BFA",
    },
    {
        icon: BarChart3,
        title: "Progress Tracking",
        desc: "A personal dashboard charts every interview attempt over time, highlighting your strongest and weakest categories.",
        color: "#FFA040",
    },
    {
        icon: Zap,
        title: "Career Copilot",
        desc: "An always-on AI coach that helps you plan next steps, prep for upcoming interviews, and stay accountable to your goals.",
        color: "#00D4FF",
    },
    {
        icon: ShieldCheck,
        title: "Secure Firebase Auth",
        desc: "Accounts, sessions, and interview history are all backed by Firebase — fast, reliable, and private by default.",
        color: "#00FFA3",
    },
];

const futurePlans = [
    {
        icon: Share2,
        title: "Shareable Score Cards",
        desc: "Export and share a polished summary of your interview performance with mentors, recruiters, or on social.",
    },
    {
        icon: Briefcase,
        title: "Recruiter Marketplace",
        desc: "Opt-in visibility so companies can discover candidates who've proven their skills directly through Voxora.",
    },
    {
        icon: Bell,
        title: "Smart Practice Reminders",
        desc: "Personalized nudges that bring you back for the next mock interview right when you need it most.",
    },
    {
        icon: Users,
        title: "Peer Mock Interviews",
        desc: "Practice live with other users in addition to the AI, then get a combined human + AI feedback report.",
    },
    {
        icon: LineChart,
        title: "Deeper Analytics",
        desc: "Trend lines across months, role-specific benchmarking, and predictive readiness scoring before real interviews.",
    },
];

const skillSnapshot = [
    { label: "Communication", value: 82, color: "#00D4FF" },
    { label: "Technical Depth", value: 67, color: "#A78BFA" },
    { label: "Problem Solving", value: 55, color: "#FFA040" },
];

const AboutVoxoraSection = () => {
    const [revealed, setRevealed] = useState(false);

    return (
        <div className="w-full max-w-[920px] mt-10 mb-6">
            {/* Scroll hint + trigger */}
            <div className="flex flex-col items-center gap-2 mb-8">
                <span className="text-light-400 text-xs">Scroll down to learn more</span>
                <ChevronDown className="size-4 text-primary-200 about-bounce" />
            </div>

            {/* Brief description */}
            <div className="text-center max-w-2xl mx-auto px-4">
                <p className="text-primary-200 text-[11px] font-bold uppercase tracking-[0.18em] mb-3">
                    About Voxora
                </p>
                <h3 className="!text-2xl">Your AI Career Copilot, end to end</h3>
                <p className="text-light-400 text-sm mt-3 leading-6">
                    Voxora AI is your AI Career Copilot, designed to help you prepare for interviews, improve your skills, discover opportunities, track your progress, and accelerate your professional growth with AI-powered guidance.
                </p>
            </div>

            {/* Click to reveal animated deep-dive */}
            {!revealed && (
                <div className="flex justify-center mt-8">
                    <button
                        onClick={() => setRevealed(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        See how Voxora works
                        <ArrowRight className="size-4" />
                    </button>
                </div>
            )}

            {revealed && (
                <div className="about-reveal mt-10 flex flex-col gap-14">
                    {/* ===== Section 1: Pipeline diagram ===== */}
                    <div className="flex flex-col items-center gap-6">
                        <h4 className="text-white text-lg font-bold text-center">
                            How Voxora takes you from practice to job-ready
                        </h4>

                        <div className="w-full overflow-x-auto">
                            <div className="flex min-w-[640px] items-center justify-center gap-2 px-2">
                                {[
                                    { icon: FileText, label: "Upload Resume", sub: "or pick a role", color: "#A78BFA", delay: 0 },
                                    { icon: Mic, label: "AI Mock Interview", sub: "voice-driven Q&A", color: "#00D4FF", delay: 0.15 },
                                    { icon: Sparkles, label: "Instant Feedback", sub: "scored by category", color: "#00FFA3", delay: 0.3 },
                                    { icon: BarChart3, label: "Track Progress", sub: "see growth over time", color: "#FFA040", delay: 0.45 },
                                    { icon: Briefcase, label: "Job Match", sub: "apply with confidence", color: "#00D4FF", delay: 0.6 },
                                ].map((step, i, arr) => (
                                    <div key={step.label} className="flex items-center">
                                        <div
                                            className="about-pop flex flex-col items-center gap-2 rounded-2xl border bg-white/[0.03] px-4 py-4 w-[128px]"
                                            style={{ borderColor: `${step.color}33`, animationDelay: `${step.delay}s` }}
                                        >
                                            <div
                                                className="flex items-center justify-center size-11 rounded-full border-2"
                                                style={{ borderColor: `${step.color}66`, background: `${step.color}1a` }}
                                            >
                                                <step.icon className="size-5" style={{ color: step.color }} />
                                            </div>
                                            <p className="text-light-100 text-[11px] font-semibold text-center leading-tight">
                                                {step.label}
                                            </p>
                                            <p className="text-light-400 text-[9px] text-center leading-tight">
                                                {step.sub}
                                            </p>
                                        </div>
                                        {i < arr.length - 1 && (
                                            <ArrowRight className="size-4 text-primary-200/50 mx-1.5 shrink-0" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ===== Section 2: What we've built ===== */}
                    <div className="flex flex-col gap-6">
                        <div className="text-center">
                            <p className="text-primary-200 text-[11px] font-bold uppercase tracking-[0.18em] mb-2">
                                Live today
                            </p>
                            <h4 className="text-white text-lg font-bold">
                                Everything we&apos;ve built so far
                            </h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {builtFeatures.map((f, i) => (
                                <div
                                    key={f.title}
                                    className="about-pop rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 flex flex-col gap-3"
                                    style={{ animationDelay: `${i * 0.08}s` }}
                                >
                                    <div
                                        className="flex items-center justify-center size-10 rounded-full border-2"
                                        style={{ borderColor: `${f.color}66`, background: `${f.color}1a` }}
                                    >
                                        <f.icon className="size-5" style={{ color: f.color }} />
                                    </div>
                                    <p className="text-white text-sm font-bold">{f.title}</p>
                                    <p className="text-light-400 text-xs leading-5">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ===== Section 3: Skill snapshot (visual) ===== */}
                    <div className="flex flex-col lg:flex-row items-center gap-8 rounded-2xl border border-primary-200/10 bg-primary-200/[0.03] p-6">
                        <div className="flex-1 flex flex-col gap-3">
                            <p className="text-primary-200 text-[11px] font-bold uppercase tracking-[0.18em]">
                                Every interview, scored
                            </p>
                            <h4 className="text-white text-base font-bold">
                                Feedback that&apos;s specific, not generic
                            </h4>
                            <p className="text-light-400 text-sm leading-6">
                                Each mock interview is broken down into the categories that
                                actually matter to interviewers — so you know exactly what to
                                work on next, instead of guessing.
                            </p>
                        </div>
                        <div className="flex-1 w-full flex flex-col gap-3">
                            {skillSnapshot.map((s, i) => (
                                <div key={s.label} className="about-grow-wrap">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-light-100 text-xs">{s.label}</span>
                                        <span className="text-xs font-semibold" style={{ color: s.color }}>
                      {s.value}%
                    </span>
                                    </div>
                                    <div className="h-2 rounded-full bg-white/[0.07] overflow-hidden">
                                        <div
                                            className="about-grow h-full rounded-full"
                                            style={
                                                {
                                                    "--w": `${s.value}%`,
                                                    background: `linear-gradient(90deg, ${s.color}, #00FFA3)`,
                                                    animationDelay: `${i * 0.15}s`,
                                                } as CSSProperties
                                            }
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ===== Section 4: Future roadmap timeline ===== */}
                    <div className="flex flex-col gap-6">
                        <div className="text-center">
                            <p className="text-primary-200 text-[11px] font-bold uppercase tracking-[0.18em] mb-2">
                                What&apos;s next
                            </p>
                            <h4 className="text-white text-lg font-bold">Future plans on the roadmap</h4>
                        </div>

                        <div className="relative flex flex-col gap-6 pl-6 sm:pl-8">
                            {/* vertical line */}
                            <div
                                className="absolute left-[7px] sm:left-[11px] top-1 bottom-1 w-px"
                                style={{ background: "linear-gradient(180deg, #00D4FF, #00FFA3, transparent)" }}
                            />
                            {futurePlans.map((f, i) => (
                                <div key={f.title} className="about-pop relative flex gap-4" style={{ animationDelay: `${i * 0.1}s` }}>
                                    <div className="absolute left-[-22px] sm:left-[-26px] top-1 flex items-center justify-center size-4 rounded-full bg-[#0d1220] border-2 border-primary-200">
                                        <div className="size-1.5 rounded-full bg-primary-200" />
                                    </div>
                                    <div className="flex items-center justify-center size-9 rounded-full border border-primary-200/30 bg-primary-200/10 shrink-0">
                                        <f.icon className="size-4 text-primary-200" />
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-semibold">{f.title}</p>
                                        <p className="text-light-400 text-xs mt-0.5 leading-5">{f.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ===== Closing CTA ===== */}
                    <div className="text-center pb-2">
                        <p className="text-light-400 text-sm">
                            Ready to see where you stand?
                        </p>
                        <p className="text-white text-base font-bold mt-1">
                            Create your account and start your first mock interview today.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AboutVoxoraSection;