"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/actions/auth.action";

const LogoutButton = () => {
    const router = useRouter();

    const handleLogout = async () => {
        await signOut();
        router.push("/sign-in");
    };

    return (
        <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-semibold text-light-400 hover:text-destructive-100 transition-colors border border-white/10 hover:border-destructive-100/40 rounded-full px-4 py-1.5 backdrop-blur-sm"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
        </button>
    );
};

export default LogoutButton;
