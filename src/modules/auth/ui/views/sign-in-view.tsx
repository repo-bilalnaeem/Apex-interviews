"use client";

import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { FaGithub, FaGoogle } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Password is required" }),
});

const SignInView = () => {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setPending(true);
    authClient.signIn.email(
      { email: data.email, password: data.password, callbackURL: "/overview" },
      {
        onSuccess: () => {
          setPending(false);
          router.push("/overview");
        },
        onError: () => setPending(false),
      }
    );
  };

  const onSocial = (provider: "github" | "google") => {
    setPending(true);
    authClient.signIn.social(
      { provider, callbackURL: "/overview" },
      {
        onSuccess: () => setPending(false),
        onError: () => setPending(false),
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
              Welcome back.
            </h1>
            <p className="mt-2 text-sm text-[#6B6B6B]">Sign in to continue.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
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
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-[13px] text-[#F5F5F5]">Password</FormLabel>
                      <Link
                        href="/reset-password"
                        className="text-xs text-[#CAFF02] hover:text-[#A8D900] transition-colors duration-150"
                      >
                        Forgot password?
                      </Link>
                    </div>
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

              <Button
                disabled={pending}
                type="submit"
                className="h-11 w-full rounded-xl bg-[#CAFF02] font-[family-name:var(--font-display)] text-sm font-bold text-black hover:bg-[#A8D900] active:scale-[0.97] transition-all duration-150 disabled:opacity-50"
              >
                {pending ? "Signing in…" : "Sign in"}
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
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="text-[#CAFF02] hover:text-[#A8D900] transition-colors duration-150"
            >
              Sign up
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
          src="https://images.unsplash.com/photo-1612113258377-ae15536472a3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fGNhbGx8ZW58MHx8MHx8fDA%3D"
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

export default SignInView;
