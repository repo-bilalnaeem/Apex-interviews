import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Example password validation function (adjust to match your sign-up rules)
function validatePassword(password: string) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return regex.test(password);
}

const SetNewPasswordView = ({ email }: { email: string }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Eye icon state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setPending(true);
    setError(null);
    // Dummy API call
    setTimeout(() => {
      setPending(false);
      setSuccess(true);
    }, 1000);
  };

  if (success)
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="overflow-hidden p-0 w-full max-w-2xl">
          <CardContent className="grid p-0 md:grid-cols-2">
            <div className="flex flex-col items-center justify-center p-8">
              <h1 className="text-2xl font-bold mb-4">You&apos;re All Set!</h1>
              <p className="mb-6">
                Your password has been reset successfully. You can now sign in with your updated password.
              </p>
              <Link href="/sign-in" className="mt-4 w-full flex justify-center">
                <Button variant="outline" className="flex items-center gap-2 px-6 py-2 font-semibold">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </Button>
              </Link>
            </div>
            <div className="relative hidden md:flex flex-col gap-y-4 items-center justify-center h-[400px] w-full">
              <Image
                fill
                src="https://images.unsplash.com/photo-1612113258377-ae15536472a3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fGNhbGx8ZW58MHx8MHx8fDA%3D"
                alt="Password Reset"
                className="object-cover"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="overflow-hidden p-0 w-full max-w-2xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="p-6 md:p-8 flex flex-col gap-8 justify-center">
            <div className="flex flex-col items-center text-center gap-2">
              <h1 className="text-2xl font-bold">Set New Password</h1>
              <p className="text-muted-foreground text-balance">
                Enter and confirm your new password for <span className="font-semibold">{email}</span>
              </p>
            </div>
            <div className="grid gap-4">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? (
                    // Eye open icon
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 4-4.5 8-9 8S3 16 3 12s4.5-8 9-8 9 4 9 8z" /></svg>
                  ) : (
                    // Eye off icon
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.94 17.94A10.94 10.94 0 0112 19c-5 0-9-4-9-7 0-1.61.81-3.06 2.06-4.06M1 1l22 22M9.88 9.88A3 3 0 0012 15a3 3 0 002.12-5.12" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" /></svg>
                  )}
                </button>
              </div>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                  tabIndex={-1}
                  onClick={() => setShowConfirmPassword((v) => !v)}
                >
                  {showConfirmPassword ? (
                    // Eye open icon
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 4-4.5 8-9 8S3 16 3 12s4.5-8 9-8 9 4 9 8z" /></svg>
                  ) : (
                    // Eye off icon
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.94 17.94A10.94 10.94 0 0112 19c-5 0-9-4-9-7 0-1.61.81-3.06 2.06-4.06M1 1l22 22M9.88 9.88A3 3 0 0012 15a3 3 0 002.12-5.12" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" /></svg>
                  )}
                </button>
              </div>
            </div>
            {error && <div className="text-red-500">{error}</div>}
            <Button type="submit" className="mt-2" disabled={pending}>
              Set New Password
            </Button>
          </form>
          <div className="relative hidden md:flex flex-col gap-y-4 items-center justify-center h-[400px] w-full">
            <Image
              fill
              src="https://images.unsplash.com/photo-1612113258377-ae15536472a3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fGNhbGx8ZW58MHx8MHx8fDA%3D"
              alt="Set Password"
              className="object-cover"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetNewPasswordView;