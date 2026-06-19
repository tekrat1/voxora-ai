import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { isAuthenticated } from "@/lib/actions/auth.action";
import AnimatedBackground from "@/components/AnimatedBackground";

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

                    <Link
                        href="/progress"
                        className="text-sm font-semibold text-light-100 hover:text-primary-200 transition-colors"
                    >
                        My Progress
                    </Link>
                </nav>

                {children}
            </div>
        </div>
    );
};

export default Layout;