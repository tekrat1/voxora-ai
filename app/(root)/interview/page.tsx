import Link from "next/link";
import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = async () => {
    const user = await getCurrentUser();

    // Optional: handle the case where user is not found
    if (!user) {
        return <p>User not found.</p>; // or redirect / show login
    }

    return (
        <>
            <h3>Interview generation</h3>

            <p className="text-light-400 -mt-2">
                Prefer something more personal?{" "}
                <Link href="/interview/resume" className="text-primary-200 font-semibold hover:underline">
                    Build an interview from your resume
                </Link>{" "}
                instead.
            </p>

            <Agent
                userName={user.name}
                userId={user.id}
                type="generate"
            />
        </>
    );
};

export default Page;
