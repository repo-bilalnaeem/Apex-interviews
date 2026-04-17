"use client";

import { Button } from "@/components/ui/button";
import {
  BotIcon,
  CalendarIcon,
  VideoIcon,
  PlusIcon,
  TrendingUpIcon,
  ClockIcon,
  HelpCircleIcon,
  ArrowRightIcon,
} from "lucide-react";
import Link from "next/link";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useTour } from "@/contexts/tour-context";
import { authClient } from "@/lib/auth-client";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const STATUS_COLORS: Record<string, string> = {
  completed: "#34D399",
  active: "#34D399",
  upcoming: "#CAFF02",
  processing: "#818CF8",
  cancelled: "#FF4444",
  ready: "#818CF8",
};

const HomeView = () => {
  const trpc = useTRPC();
  const { restartTour } = useTour();
  const { data: session } = authClient.useSession();

  const { data: stats } = useSuspenseQuery(
    trpc.dashboard.getStats.queryOptions()
  );
  const { data: recentActivity } = useSuspenseQuery(
    trpc.dashboard.getRecentActivity.queryOptions()
  );

  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="flex flex-col gap-y-6 p-6 dashboard-btn">
      {/* Header */}
      <div>
        <p className="text-[13px] text-[#6B6B6B]">
          {getGreeting()}, {firstName}
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-[32px] font-bold leading-tight text-white">
          Overview
        </h1>
      </div>

      {/* Hero card */}
      <div className="flex items-center justify-between rounded-2xl border border-[#CAFF02]/20 bg-[#141414] p-6">
        <div className="flex flex-col gap-3">
          <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#6B6B6B]">
            APEX INTERVIEWS
          </span>
          <p className="font-[family-name:var(--font-display)] text-[22px] font-bold text-white leading-snug">
            Ace your next interview.
          </p>
          <p className="text-sm text-[#6B6B6B] max-w-xs">
            Create AI agents, run live video interviews, and get instant AI-generated feedback.
          </p>
          <Button
            asChild
            className="mt-1 w-fit rounded-xl bg-[#CAFF02] px-5 font-[family-name:var(--font-display)] text-sm font-bold text-black hover:bg-[#A8D900] active:scale-[0.97] transition-all duration-150"
          >
            <Link href="/meetings">
              Start Now <ArrowRightIcon className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="hidden sm:flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#CAFF02]">
          <span className="font-[family-name:var(--font-display)] text-2xl font-bold text-black">
            AI
          </span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Meetings */}
        <div className="rounded-xl bg-[#141414] border border-[#2A2A2A] p-5">
          <div className="flex items-start justify-between">
            <span
              className="font-[family-name:var(--font-display)] text-[48px] font-bold leading-none"
              style={{ color: "#CAFF02" }}
            >
              {stats.totalMeetings}
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#CAFF02]/10">
              <VideoIcon className="h-4 w-4" style={{ color: "#CAFF02" }} />
            </div>
          </div>
          <p className="mt-3 text-sm font-medium text-[#F5F5F5]">Total Meetings</p>
          <p className="mt-0.5 text-xs text-[#6B6B6B]">{stats.totalMeetingsText}</p>
        </div>

        {/* Upcoming */}
        <div className="rounded-xl bg-[#141414] border border-[#2A2A2A] p-5">
          <div className="flex items-start justify-between">
            <span
              className="font-[family-name:var(--font-display)] text-[48px] font-bold leading-none"
              style={{ color: "#FBBF24" }}
            >
              {stats.upcomingMeetings}
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FBBF24]/10">
              <CalendarIcon className="h-4 w-4" style={{ color: "#FBBF24" }} />
            </div>
          </div>
          <p className="mt-3 text-sm font-medium text-[#F5F5F5]">Upcoming</p>
          <p className="mt-0.5 text-xs text-[#6B6B6B]">{stats.upcomingText}</p>
        </div>

        {/* Active */}
        <div className="rounded-xl bg-[#141414] border border-[#2A2A2A] p-5">
          <div className="flex items-start justify-between">
            <span
              className="font-[family-name:var(--font-display)] text-[48px] font-bold leading-none"
              style={{ color: "#34D399" }}
            >
              {stats.activeMeetings}
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#34D399]/10">
              <TrendingUpIcon className="h-4 w-4" style={{ color: "#34D399" }} />
            </div>
          </div>
          <p className="mt-3 text-sm font-medium text-[#F5F5F5]">Active</p>
          <p className="mt-0.5 text-xs text-[#6B6B6B]">{stats.activeMeetingsText}</p>
        </div>

        {/* AI Agents */}
        <div className="rounded-xl bg-[#141414] border border-[#2A2A2A] p-5">
          <div className="flex items-start justify-between">
            <span
              className="font-[family-name:var(--font-display)] text-[48px] font-bold leading-none"
              style={{ color: "#818CF8" }}
            >
              {stats.totalAgents}
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#818CF8]/10">
              <BotIcon className="h-4 w-4" style={{ color: "#818CF8" }} />
            </div>
          </div>
          <p className="mt-3 text-sm font-medium text-[#F5F5F5]">AI Agents</p>
          <p className="mt-0.5 text-xs text-[#6B6B6B]">{stats.agentsText}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl bg-[#141414] border border-[#2A2A2A] p-6">
        <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.12em] text-[#6B6B6B]">
          QUICK ACTIONS
        </p>
        <div className="flex flex-col gap-3 sm:flex-row create-meeting-btn">
          <Button
            asChild
            className="h-10 flex-1 rounded-xl bg-[#CAFF02] font-[family-name:var(--font-display)] text-sm font-bold text-black hover:bg-[#A8D900] active:scale-[0.97] transition-all duration-150 create-meeting-btn"
          >
            <Link href="/meetings">
              <PlusIcon className="mr-2 h-4 w-4" />
              Create Meeting
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-10 flex-1 rounded-xl border-[#2A2A2A] bg-[#1E1E1E] text-[#F5F5F5] hover:border-[#CAFF02]/30 hover:bg-[#252525] transition-all duration-150 generate-agent-btn manage-agents-btn"
          >
            <Link href="/agents">
              <BotIcon className="mr-2 h-4 w-4" />
              Manage Agents
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-10 flex-1 rounded-xl border-[#2A2A2A] bg-[#1E1E1E] text-[#F5F5F5] hover:border-[#CAFF02]/30 hover:bg-[#252525] transition-all duration-150 view-meetings-btn"
          >
            <Link href="/meetings">
              <VideoIcon className="mr-2 h-4 w-4" />
              View All Meetings
            </Link>
          </Button>
          <Button
            onClick={restartTour}
            variant="outline"
            className="h-10 flex-1 rounded-xl border-[#2A2A2A] bg-[#1E1E1E] text-[#F5F5F5] hover:border-[#CAFF02]/30 hover:bg-[#252525] transition-all duration-150"
            title="Restart the guided tour"
          >
            <HelpCircleIcon className="mr-2 h-4 w-4" />
            Take Tour
          </Button>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#6B6B6B]">
            RECENT ACTIVITY
          </p>
          <Link
            href="/meetings"
            className="text-xs text-[#CAFF02] hover:text-[#A8D900] transition-colors duration-150"
          >
            See all →
          </Link>
        </div>

        {recentActivity.length > 0 ? (
          <div className="flex flex-col gap-2">
            {recentActivity.map((activity) => {
              const color = STATUS_COLORS[activity.status] ?? "#6B6B6B";
              const initial = activity.title.charAt(0).toUpperCase();
              return (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 rounded-xl bg-[#141414] border border-[#2A2A2A] px-4 py-3"
                >
                  {/* Avatar circle */}
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                    style={{ background: `${color}18`, color }}
                  >
                    {initial}
                  </div>
                  {/* Text */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#F5F5F5]">
                      {activity.title}
                    </p>
                    <p className="truncate text-xs text-[#6B6B6B]">
                      {activity.description}
                    </p>
                  </div>
                  {/* Time */}
                  <div className="flex shrink-0 items-center gap-1 text-xs text-[#6B6B6B]">
                    <ClockIcon className="h-3 w-3" />
                    {activity.time}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[#2A2A2A] bg-[#141414] py-12 text-center">
            <ClockIcon className="mb-4 h-10 w-10 text-[#6B6B6B]" />
            <p className="text-sm font-medium text-[#F5F5F5]">No recent activity</p>
            <p className="mt-1 text-xs text-[#6B6B6B]">
              Create your first meeting or agent to see activity here.
            </p>
            <div className="mt-4 flex gap-3">
              <Button
                asChild
                size="sm"
                className="rounded-xl bg-[#CAFF02] font-[family-name:var(--font-display)] text-xs font-bold text-black hover:bg-[#A8D900] transition-all duration-150"
              >
                <Link href="/meetings">
                  <PlusIcon className="mr-1.5 h-3.5 w-3.5" />
                  Create Meeting
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="rounded-xl border-[#2A2A2A] bg-[#1E1E1E] text-[#F5F5F5] hover:border-[#CAFF02]/30 hover:bg-[#252525] transition-all duration-150"
              >
                <Link href="/agents">
                  <BotIcon className="mr-1.5 h-3.5 w-3.5" />
                  Create Agent
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeView;

export const HomeViewLoading = () => {
  return (
    <div className="flex flex-col gap-y-6 p-6">
      {/* Header */}
      <div>
        <div className="h-4 w-32 animate-pulse rounded bg-[#1E1E1E]" />
        <div className="mt-1.5 h-9 w-44 animate-pulse rounded bg-[#1E1E1E]" />
      </div>

      {/* Hero card */}
      <div className="h-40 animate-pulse rounded-2xl bg-[#141414]" />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-5">
            <div className="flex items-start justify-between">
              <div className="h-12 w-10 animate-pulse rounded bg-[#1E1E1E]" />
              <div className="h-9 w-9 animate-pulse rounded-full bg-[#1E1E1E]" />
            </div>
            <div className="mt-3 h-4 w-28 animate-pulse rounded bg-[#1E1E1E]" />
            <div className="mt-1.5 h-3 w-20 animate-pulse rounded bg-[#1E1E1E]" />
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl border border-[#2A2A2A] bg-[#141414] p-6">
        <div className="mb-4 h-3 w-24 animate-pulse rounded bg-[#1E1E1E]" />
        <div className="flex gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 flex-1 animate-pulse rounded-xl bg-[#1E1E1E]" />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="mb-4 h-3 w-28 animate-pulse rounded bg-[#1E1E1E]" />
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 rounded-xl border border-[#2A2A2A] bg-[#141414] px-4 py-3">
              <div className="h-9 w-9 animate-pulse rounded-full bg-[#1E1E1E]" />
              <div className="flex-1">
                <div className="h-4 w-40 animate-pulse rounded bg-[#1E1E1E]" />
                <div className="mt-1.5 h-3 w-56 animate-pulse rounded bg-[#1E1E1E]" />
              </div>
              <div className="h-3 w-14 animate-pulse rounded bg-[#1E1E1E]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const HomeViewError = () => {
  return (
    <div className="flex min-h-96 flex-col items-center justify-center gap-3 p-6 text-center">
      <p className="font-[family-name:var(--font-display)] text-2xl font-bold text-white">
        Unable to load dashboard
      </p>
      <p className="text-sm text-[#6B6B6B]">
        There was an error loading your dashboard data. Please try refreshing the page.
      </p>
      <Button
        onClick={() => window.location.reload()}
        variant="outline"
        className="mt-2 rounded-xl border-[#2A2A2A] bg-[#1E1E1E] text-[#F5F5F5] hover:border-[#CAFF02]/30 hover:bg-[#252525] transition-all duration-150"
      >
        Refresh Page
      </Button>
    </div>
  );
};
