import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { isAuthenticated } from "@/lib/actions/auth.action";
import AnimatedBackground from "@/components/AnimatedBackground";
import LogoutButton from "@/components/LogoutButton";

const Layout = async ({ children }: { children: ReactNode }) => {
    const isUserAuthenticated = await isAuthenticated();
    if (!isUserAuthenticated) redirect("/sign-in");

    return (
        <div className="relative" suppressHydrationWarning>
            <AnimatedBackground />
            <div className="root-layout relative z-10">
                <nav className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/logo.svg" alt="Voxora AI Logo" width={38} height={32} />
                        <h2 className="text-primary-100">Voxora AI</h2>
                    </Link>

                    <div className="flex items-center gap-6">
                        <Link
                            href="/jobs"
                            className="text-sm font-semibold text-light-100 hover:text-primary-200 transition-colors flex items-center gap-1"
                        >
                            Job Match
                            <span className="text-[9px] font-bold bg-amber-400/20 text-amber-400 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                                Soon
                            </span>
                        </Link>
                        <Link
                            href="/progress"
                            className="text-sm font-semibold text-light-100 hover:text-primary-200 transition-colors"
                        >
                            My Progress
                        </Link>
                        <Link
                            href="/copilot"
                            className="text-sm font-semibold text-light-100 hover:text-primary-200 transition-colors flex items-center gap-1"
                        >
                            <span>⚡</span> Copilot
                        </Link>
                        <LogoutButton />
                    </div>
                </nav>

                {children}
            </div>
        </div>
    );
};

export default Layout;