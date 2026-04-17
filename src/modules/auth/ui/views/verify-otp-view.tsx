import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const VerifyOtpView = ({ email, onNext }: { email: string, onNext: (otp: string) => void }) => {
  const [otp, setOtp] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError(null);
    // Dummy API call
    setTimeout(() => {
      setPending(false);
      if (otp.length === 6) onNext(otp);
      else setError("Invalid OTP");
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="overflow-hidden p-0 w-full max-w-2xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="p-6 md:p-8 flex flex-col gap-8 justify-center">
            <div className="flex flex-col items-center text-center gap-2">
              <h1 className="text-2xl font-bold">Verify OTP</h1>
              <p className="text-muted-foreground text-balance">
                Enter the 6-digit OTP sent to <span className="font-semibold">{email}</span>
              </p>
            </div>
            <div className="grid gap-4">
              <Input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                required
                maxLength={6}
              />
            </div>
            {error && <div className="text-red-500">{error}</div>}
            <Button type="submit" className="mt-2" disabled={pending}>
              Verify OTP
            </Button>
          </form>
          <div className="relative hidden md:flex flex-col gap-y-4 items-center justify-center h-[400px] w-full">
            <Image
              fill
              src="https://images.unsplash.com/photo-1612113258377-ae15536472a3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fGNhbGx8ZW58MHx8MHx8fDA%3D"
              alt="OTP Verification"
              className="object-cover"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyOtpView;