"use client";

import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { auth } from "@/firebase/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { signIn, signUp } from "@/lib/actions/auth.action";
import FormField from "./FormField";
import AISidePanel from "./AISidePanel";
import AboutVoxoraSection from "./AboutVoxoraSection";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (type === "sign-up") {
        const { name, email, password } = data;

        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success("Account created successfully. Please sign in.");
        router.push("/sign-in");
      } else {
        const { email, password } = data;

        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        const idToken = await userCredential.user.getIdToken();
        if (!idToken) {
          toast.error("Sign in Failed. Please try again.");
          return;
        }

        await signIn({
          email,
          idToken,
        });

        toast.success("Signed in successfully.");
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(`There was an error: ${error}`);
    }
  };

  const isSignIn = type === "sign-in";

  return (
      <div className="w-full flex flex-col items-center">
        {/* Split-screen auth card */}
        <div className="card-border" style={{ width: "100%", maxWidth: "100%" }}>
          <div className="card overflow-hidden p-0 flex flex-col">
            {/* top accent bar spans the FULL card width, no seam */}
            <div className="h-[3px] max-h-[3px] w-full shrink-0 auth-top-bar" />

            <div className="grid grid-cols-1 lg:grid-cols-2 flex-1">
              {/* LEFT: AI visual panel (hidden on small screens) */}
              <div className="hidden lg:block">
                <AISidePanel />
              </div>

              {/* RIGHT: Auth form */}
              <div className="flex flex-col bg-[#0B1220]">
                <div className="flex flex-col gap-5 px-6 py-8 sm:px-10 sm:py-10 flex-1 bg-[#0B1220]">
                  <div className="flex items-center justify-center gap-3">
                    <div className="flex items-center justify-center size-12 rounded-full border-2 border-primary-200/45 bg-gradient-to-br from-[#00D4FF40] to-[#00FFA333]">
                      <Image src="/logo.svg" alt="logo" height={24} width={28} />
                    </div>
                    <div>
                      <p className="text-white text-xl font-extrabold tracking-tight leading-none">
                        Voxora AI
                      </p>
                      <p className="text-primary-200 text-[10px] font-semibold uppercase tracking-widest mt-1">
                        Your AI Career Copilot
                      </p>
                    </div>
                  </div>

                  <div className="text-center">
                    <h3 className="!text-lg">
                      {isSignIn ? "Welcome back" : "Start your career journey"}
                    </h3>
                    <p className="text-light-400 text-[13px] mt-1">
                      {isSignIn
                          ? "Sign in to continue your career journey"
                          : "Create an account to begin with Voxora AI"}
                    </p>
                  </div>

                  <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full space-y-5 form"
                    >
                      {!isSignIn && (
                          <FormField
                              control={form.control}
                              name="name"
                              label="Name"
                              placeholder="Your Name"
                              type="text"
                          />
                      )}

                      <FormField
                          control={form.control}
                          name="email"
                          label="Email"
                          placeholder="Your email address"
                          type="email"
                      />

                      <FormField
                          control={form.control}
                          name="password"
                          label="Password"
                          placeholder="Enter your password"
                          type="password"
                      />

                      <Button className="btn" type="submit">
                        {isSignIn ? "Sign In" : "Create an Account"}
                      </Button>
                    </form>
                  </Form>

                  <p className="text-center text-[13px]">
                    {isSignIn ? "No account yet?" : "Have an account already?"}
                    <Link
                        href={isSignIn ? "/sign-up" : "/sign-in"}
                        className="font-bold text-primary-200 ml-1"
                    >
                      {isSignIn ? "Sign Up" : "Sign In"}
                    </Link>
                  </p>

                  {/* Career Operating System mini-grid */}
                  <div className="rounded-xl border border-primary-200/10 bg-primary-200/[0.04] p-3 mt-1">
                    <p className="text-primary-200 text-[9px] font-bold uppercase tracking-[0.18em] text-center mb-2">
                      Career Operating System
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { icon: "🎯", title: "AI Mock Interviews", sub: "Practice & feedback" },
                        { icon: "📄", title: "Resume → Job Match", sub: "AI role matching" },
                        { icon: "📊", title: "Progress Tracking", sub: "Skill growth charts" },
                        { icon: "⚡", title: "Career Copilot", sub: "AI coaching" },
                      ].map((f) => (
                          <div
                              key={f.title}
                              className="flex items-center gap-1.5 rounded-lg border border-primary-200/10 bg-white/[0.03] px-2 py-1.5"
                          >
                            <span className="text-sm leading-none">{f.icon}</span>
                            <div className="leading-tight">
                              <p className="text-light-100 text-[9px] font-semibold">
                                {f.title}
                              </p>
                              <p className="text-light-400 text-[8px]">{f.sub}</p>
                            </div>
                          </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll-down: About Voxora */}
        <AboutVoxoraSection />
      </div>
  );
};

export default AuthForm;