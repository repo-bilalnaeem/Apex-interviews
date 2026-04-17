import React from "react";
import SettingsView, {
  SettingsViewError,
} from "@/modules/settings/ui/views/settings-view";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ErrorBoundary } from "react-error-boundary";

const page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <ErrorBoundary fallback={<SettingsViewError />}>
      <SettingsView />
    </ErrorBoundary>
  );
};

export default page;