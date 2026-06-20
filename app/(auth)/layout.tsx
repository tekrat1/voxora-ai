import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/actions/auth.action";
import AnimatedBackground from "@/components/AnimatedBackground";

const AuthLayout = async ({ children }: { children: ReactNode }) => {
    const isUserAuthenticated = await isAuthenticated();
    if (isUserAuthenticated) redirect("/");

    return (
        <div className="relative min-h-screen flex items-center justify-center px-3 py-8 sm:px-6">
            <AnimatedBackground />
            <div className="relative z-10 w-full flex justify-center">{children}</div>
        </div>
    );
};

export default AuthLayout;