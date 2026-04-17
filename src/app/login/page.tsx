import { Metadata } from "next";
import { LoginForm } from "@/components/login-form";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Login - AI Interview Agents",
  description:
    "Login to your AI Interview Agents account to access your recruitment dashboard and manage your interview process.",
  robots: {
    index: false,
    follow: true,
  },
};

export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!!session) {
    redirect("/overview");
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  );
}
