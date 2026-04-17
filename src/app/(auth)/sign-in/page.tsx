import React from "react";
import { Metadata } from "next";
import SignInView from "@/modules/auth/ui/views/sign-in-view";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign In - Access Your Dashboard",
  description:
    "Sign in to your AI Interview Agents account to manage your interview agents, view analytics, and streamline your hiring process.",
  openGraph: {
    title: "Sign In to AI Interview Agents",
    description:
      "Access your AI-powered recruitment dashboard and manage your interview process.",
  },
  twitter: {
    title: "Sign In to AI Interview Agents",
    description:
      "Access your AI-powered recruitment dashboard and manage your interview process.",
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

  return <SignInView />;
};

export default page;
