import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
    getInterviewsByUserId,
    getLatestInterviews,
} from "@/lib/actions/general.action";

async function Home() {
    const user = await getCurrentUser();

    if (!user || !user.id) {
        return (
            <div className="text-center mt-10">
                <h2 className="text-2xl font-semibold">You must be logged in</h2>
            </div>
        );
    }

    const [userInterviewsRaw, allInterviewRaw] = await Promise.all([
        getInterviewsByUserId(user.id),
        getLatestInterviews({ userId: user.id }),
    ]);

    const userInterviews = userInterviewsRaw ?? [];
    const allInterview = allInterviewRaw ?? [];

    const hasPastInterviews = userInterviews.length > 0;
    const hasUpcomingInterviews = allInterview.length > 0;

    return (
        <>
            {/* Hero CTA */}
            <section className="card-cta">
                <div className="flex flex-col gap-6 max-w-lg">
                    <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
                    <p className="text-lg">
                        Practice real interview questions & get instant feedback
                    </p>

                    <div className="flex flex-wrap gap-3">
                        <Button asChild className="btn-primary max-sm:w-full">
                            <Link href="/interview">Start an Interview</Link>
                        </Button>
                        <Button asChild className="btn-secondary max-sm:w-full">
                            <Link href="/interview/resume">Build From My Resume</Link>
                        </Button>
                        <Button asChild className="btn-secondary max-sm:w-full">
                            <Link href="/jobs">
                                Find Job Matches
                            </Link>
                        </Button>
                    </div>
                </div>

                <Image
                    src="/robot.png"
                    alt="robo-dude"
                    width={400}
                    height={400}
                    className="max-sm:hidden"
                />
            </section>

            {/* Career Operating System Section */}
            <section className="mt-10">
                <div className="flex items-center gap-3 mb-4">
                    <h2>Career Operating System</h2>
                    <span className="text-xs font-bold bg-user-primary/20 text-user-primary px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Your AI Copilot
                    </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        {
                            icon: "🎯",
                            title: "AI Mock Interviews",
                            desc: "Simulate real interviews with voice-powered AI and receive instant detailed feedback.",
                            href: "/interview",
                            cta: "Start Practice",
                            color: "from-cyan-500/10 to-teal-500/10",
                        },
                        {
                            icon: "📄",
                            title: "Resume → Job Match",
                            desc: "Upload your resume and instantly match it to top open roles with skill gap analysis.",
                            href: "/jobs",
                            cta: "Match Now",
                            color: "from-purple-500/10 to-blue-500/10",
                        },
                        {
                            icon: "📊",
                            title: "Progress Tracker",
                            desc: "Track your scores and skill evolution across every interview you've taken.",
                            href: "/progress",
                            cta: "View Progress",
                            color: "from-amber-500/10 to-orange-500/10",
                        },
                        {
                            icon: "⚡",
                            title: "Career Copilot",
                            desc: "Get personalised AI career coaching, tips, and a tailored roadmap for your goals.",
                            href: "/copilot",
                            cta: "Open Copilot",
                            color: "from-green-500/10 to-emerald-500/10",
                        },
                    ].map((item) => (
                        <Link
                            key={item.title}
                            href={item.href}
                            className={`rounded-2xl border border-white/10 bg-gradient-to-br ${item.color} p-5 flex flex-col gap-3 hover:border-primary-200/40 transition-all group`}
                        >
                            <span className="text-3xl">{item.icon}</span>
                            <h3 className="text-base font-bold text-light-100">{item.title}</h3>
                            <p className="text-xs text-light-400 flex-1">{item.desc}</p>
                            <span className="text-xs font-semibold text-user-primary group-hover:underline">
                                {item.cta} →
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Upcoming Features Banner */}
            <section className="mt-10">
                <div className="flex items-center gap-3 mb-4">
                    <h2>Coming Soon</h2>
                    <span className="text-xs font-bold bg-amber-400/20 text-amber-400 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                        Upcoming
                    </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                        {
                            icon: "🧠",
                            title: "AI Resume Builder",
                            desc: "Generate a polished, ATS-optimised resume in seconds from your interview history and skills.",
                            eta: "Q3 2026",
                        },
                        {
                            icon: "🤝",
                            title: "1-on-1 Mentor Matching",
                            desc: "Get paired with industry professionals for live mock interviews and career guidance sessions.",
                            eta: "Q3 2026",
                        },
                        {
                            icon: "🗺️",
                            title: "Personalised Career Roadmap",
                            desc: "Receive a step-by-step AI-generated learning path tailored to your target role and skill gaps.",
                            eta: "Q4 2026",
                        },
                        {
                            icon: "🏢",
                            title: "Company-Specific Prep",
                            desc: "Practice with curated question banks and culture guides for Google, Amazon, Microsoft and more.",
                            eta: "Q4 2026",
                        },
                        {
                            icon: "📅",
                            title: "Interview Scheduler",
                            desc: "Book and manage real interview slots with partner companies directly from Voxora AI.",
                            eta: "Q1 2027",
                        },
                        {
                            icon: "🌐",
                            title: "Multilingual Support",
                            desc: "Practice interviews in 20+ languages with AI feedback adapted to your target region.",
                            eta: "Q1 2027",
                        },
                    ].map((feature) => (
                        <div
                            key={feature.title}
                            className="rounded-2xl border border-dashed border-white/10 bg-white/3 p-5 flex flex-col gap-3 opacity-80"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-2xl">{feature.icon}</span>
                                <span className="text-[10px] font-bold bg-amber-400/10 text-amber-400 px-2 py-0.5 rounded-full">
                                    {feature.eta}
                                </span>
                            </div>
                            <h3 className="text-sm font-bold text-light-100">{feature.title}</h3>
                            <p className="text-xs text-light-400">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Your Interviews */}
            <section className="flex flex-col gap-6 mt-10">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <h2>Your Interviews</h2>
                    {hasPastInterviews && (
                        <Link
                            href="/progress"
                            className="text-sm font-semibold text-primary-200 hover:underline"
                        >
                            View My Progress →
                        </Link>
                    )}
                </div>

                <div className="interviews-section">
                    {hasPastInterviews ? (
                        userInterviews.map((interview) => (
                            <InterviewCard
                                key={interview.id}
                                userId={user.id}
                                interviewId={interview.id}
                                role={interview.role}
                                type={interview.type}
                                techstack={interview.techstack}
                                createdAt={interview.createdAt}
                            />
                        ))
                    ) : (
                        <p>You haven&apos;t taken any interviews yet</p>
                    )}
                </div>
            </section>

            {/* Take Interviews */}
            <section className="flex flex-col gap-6 mt-8">
                <h2>Take Interviews</h2>

                <div className="interviews-section">
                    {hasUpcomingInterviews ? (
                        allInterview.map((interview) => (
                            <InterviewCard
                                key={interview.id}
                                userId={user.id}
                                interviewId={interview.id}
                                role={interview.role}
                                type={interview.type}
                                techstack={interview.techstack}
                                createdAt={interview.createdAt}
                            />
                        ))
                    ) : (
                        <p>There are no interviews available</p>
                    )}
                </div>
            </section>

            {/* Simple Footer */}
            <footer className="mt-16 border-t pt-6 text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} Created by{" "}
                <span className="font-semibold text-primary">Tekrat</span>
            </footer>
        </>
    );
}

export default Home;