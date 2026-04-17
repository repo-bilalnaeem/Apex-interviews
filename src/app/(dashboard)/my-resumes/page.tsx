import React, { Suspense } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ResumeAssistantView, {
  ResumeAssistantViewLoading,
  ResumeAssistantViewError,
} from "@/modules/resume-assistant/ui/views/resume-assistant-view";
import { ErrorBoundary } from "react-error-boundary";

const ResumeAssistantPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <Suspense fallback={<ResumeAssistantViewLoading />}>
      <ErrorBoundary fallback={<ResumeAssistantViewError />}>
        <ResumeAssistantView />
      </ErrorBoundary>
    </Suspense>
  );
};

export default ResumeAssistantPage;