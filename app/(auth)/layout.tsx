import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/actions/auth.action";
import AnimatedBackground from "@/components/AnimatedBackground";

const AuthLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (isUserAuthenticated) redirect("/");

  return (
      <div className="relative min-h-screen flex items-center justify-center max-sm:px-4 max-sm:py-8">
        <AnimatedBackground />
        <div className="relative z-10">{children}</div>
      </div>
  );
};

export default AuthLayout;