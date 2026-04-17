"use client";

import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft, Eye, EyeOff, OctagonAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { FaGithub, FaGoogle } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import zxcvbn from "zxcvbn";

const formSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password is required" }),
    confirmPassword: z.string().min(1, { message: "Password confirmation is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      const { score } = zxcvbn(data.password);
      return score >= 3;
    },
    {
      message: "Password is too weak. Try a mix of upper/lowercase, numbers, and symbols.",
      path: ["password"],
    }
  );

type SignUpForm = z.infer<typeof formSchema>;

const SignUpView = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<SignUpForm>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: SignUpForm) => {
    setError(null);
    setPending(true);

    authClient.signUp.email(
      { name: data.name, email: data.email, password: data.password, callbackURL: "/overview" },
      {
        onSuccess: async () => {
          setPending(false);
          try {
            await fetch("/api/send-welcome-mail", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: data.email, name: data.name }),
            });
          } catch {}
          router.push("/overview");
        },
        onError: ({ error }) => {
          setPending(false);
          setError(error.message);
        },
      }
    );
  };

  const onSocial = (provider: "github" | "google") => {
    setError(null);
    setPending(true);
    authClient.signIn.social(
      { provider, callbackURL: "/overview" },
      {
        onSuccess: () => setPending(false),
        onError: ({ error }) => {
          setPending(false);
          setError(error.message);
        },
      }
    );
  };

  return (
    <div className="flex min-h-screen bg-[#0A0A0A]">
      {/* Left panel — form */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 md:w-[60%] lg:px-20">
        {/* Back arrow */}
        <Link
          href="/"
          className="mb-6 flex items-center gap-1.5 self-start text-sm text-[#6B6B6B] hover:text-[#F5F5F5] transition-colors duration-150"
        >
          <ArrowLeft size={16} />
          Back
        </Link>

        {/* Wordmark */}
        <p className="mb-10 font-[family-name:var(--font-display)] text-[20px] font-bold tracking-widest text-white">
          APEX
        </p>

        <div className="w-full max-w-[380px]">
          <div className="mb-8">
            <h1 className="font-[family-name:var(--font-display)] text-[40px] font-bold leading-tight text-white">
              Let&apos;s get you hired.
            </h1>
            <p className="mt-2 text-sm text-[#6B6B6B]">Create your account to get started.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[13px] text-[#F5F5F5]">Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="John Doe"
                        className="h-11 rounded-xl border-[#2A2A2A] bg-[#141414] text-[#F5F5F5] placeholder:text-[#6B6B6B] focus-visible:border-[#CAFF02] focus-visible:ring-1 focus-visible:ring-[#CAFF02]/30 transition-colors duration-150"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-[#FF4444]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[13px] text-[#F5F5F5]">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        className="h-11 rounded-xl border-[#2A2A2A] bg-[#141414] text-[#F5F5F5] placeholder:text-[#6B6B6B] focus-visible:border-[#CAFF02] focus-visible:ring-1 focus-visible:ring-[#CAFF02]/30 transition-colors duration-150"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-[#FF4444]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[13px] text-[#F5F5F5]">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="h-11 rounded-xl border-[#2A2A2A] bg-[#141414] pr-10 text-[#F5F5F5] placeholder:text-[#6B6B6B] focus-visible:border-[#CAFF02] focus-visible:ring-1 focus-visible:ring-[#CAFF02]/30 transition-colors duration-150"
                          {...field}
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#F5F5F5] transition-colors duration-150"
                          onClick={() => setShowPassword((v) => !v)}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-[#FF4444]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[13px] text-[#F5F5F5]">Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="h-11 rounded-xl border-[#2A2A2A] bg-[#141414] pr-10 text-[#F5F5F5] placeholder:text-[#6B6B6B] focus-visible:border-[#CAFF02] focus-visible:ring-1 focus-visible:ring-[#CAFF02]/30 transition-colors duration-150"
                          {...field}
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#F5F5F5] transition-colors duration-150"
                          onClick={() => setShowConfirmPassword((v) => !v)}
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-[#FF4444]" />
                  </FormItem>
                )}
              />

              {error && (
                <Alert className="border-[#FF4444]/30 bg-[#FF4444]/10">
                  <OctagonAlert className="h-4 w-4 text-[#FF4444]" />
                  <AlertTitle className="text-sm text-[#FF4444]">{error}</AlertTitle>
                </Alert>
              )}

              <Button
                disabled={pending}
                type="submit"
                className="h-11 w-full rounded-xl bg-[#CAFF02] font-[family-name:var(--font-display)] text-sm font-bold text-black hover:bg-[#A8D900] active:scale-[0.97] transition-all duration-150 disabled:opacity-50"
              >
                {pending ? "Creating account…" : "Create account"}
              </Button>
            </form>
          </Form>

          {/* Divider */}
          <div className="relative my-6 flex items-center gap-4">
            <div className="flex-1 border-t border-[#2A2A2A]" />
            <span className="text-xs text-[#6B6B6B]">Or continue with</span>
            <div className="flex-1 border-t border-[#2A2A2A]" />
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              disabled={pending}
              type="button"
              variant="outline"
              className="h-11 rounded-xl border-[#2A2A2A] bg-[#1E1E1E] text-[#F5F5F5] hover:border-[#CAFF02]/30 hover:bg-[#252525] transition-all duration-150"
              onClick={() => onSocial("google")}
            >
              <FaGoogle className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button
              disabled={pending}
              type="button"
              variant="outline"
              className="h-11 rounded-xl border-[#2A2A2A] bg-[#1E1E1E] text-[#F5F5F5] hover:border-[#CAFF02]/30 hover:bg-[#252525] transition-all duration-150"
              onClick={() => onSocial("github")}
            >
              <FaGithub className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-[#6B6B6B]">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-[#CAFF02] hover:text-[#A8D900] transition-colors duration-150"
            >
              Sign in
            </Link>
          </p>

          <p className="mt-6 text-center text-xs text-[#6B6B6B]">
            By continuing, you agree to our{" "}
            <a href="#" className="underline underline-offset-4 hover:text-[#F5F5F5] transition-colors duration-150">
              Terms of Service
            </a>
          </p>
        </div>
      </div>

      {/* Right panel — image */}
      <div className="relative hidden md:block md:w-[40%]">
        <Image
          fill
          src="https://images.unsplash.com/photo-1587560699334-bea93391dcef?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
          className="object-cover"
          priority
        />
        {/* Gradient bleeding into the form side */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
      </div>
    </div>
  );
};

export default SignUpView;
