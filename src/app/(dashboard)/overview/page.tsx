import React, { Suspense } from "react";
import HomeView, {
  HomeViewLoading,
  HomeViewError,
} from "@/modules/home/ui/views/home-view";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import TourGuide from "../tourGuide/page";
import { TourProvider } from "@/contexts/tour-context";

const page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const queryClient = getQueryClient();

  // Prefetch dashboard data
  void queryClient.prefetchQuery(trpc.dashboard.getStats.queryOptions());
  void queryClient.prefetchQuery(
    trpc.dashboard.getRecentActivity.queryOptions()
  );

  return (
    <TourProvider>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<HomeViewLoading />}>
          <ErrorBoundary fallback={<HomeViewError />}>
            <TourGuide/>
            <HomeView />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </TourProvider>
  );
};

export default page;
