import React from "react";
import { Metadata } from "next";
import SignUpView from "@/modules/auth/ui/views/sign-up-view";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign Up - Start Your Free Trial",
  description: "Create your AI Interview Agents account and start transforming your hiring process today. Free trial available with no credit card required.",
  openGraph: {
    title: "Sign Up for AI Interview Agents - Free Trial",
    description: "Create your account and start using AI-powered interview agents to revolutionize your recruitment process.",
  },
  twitter: {
    title: "Sign Up for AI Interview Agents - Free Trial",
    description: "Create your account and start using AI-powered interview agents to revolutionize your recruitment process.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!!session) {
    redirect("/overview");
  }

  return <SignUpView />;
};

export default page;
