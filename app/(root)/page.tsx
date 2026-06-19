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

    // If user is not logged in, you can either redirect or show a message.
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
                            <Link href="/jobs">Find Job Matches</Link>
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

            <section className="flex flex-col gap-6 mt-8">
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
