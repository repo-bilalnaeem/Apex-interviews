"use client";

import React, { useState } from "react";
import ResetPasswordRequestView from "@/modules/auth/ui/views/reset-password-request-view";
import VerifyOtpView from "@/modules/auth/ui/views/verify-otp-view";
import SetNewPasswordView from "@/modules/auth/ui/views/set-new-password-view";

const ResetPasswordPage = () => {
  const [step, setStep] = useState<"request" | "verify" | "set">("request");
  const [email, setEmail] = useState("");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      {step === "request" && (
        <ResetPasswordRequestView onNext={email => { setEmail(email); setStep("verify"); }} />
      )}
      {step === "verify" && (
        <VerifyOtpView email={email} onNext={() => { setStep("set"); }} />
      )}
      {step === "set" && (
        <SetNewPasswordView email={email} />
      )}
    </div>
  );
};

export default ResetPasswordPage;