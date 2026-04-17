"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
import DataPagination from "@/components/data-pagination";
import { format } from "date-fns";
import { ClockIcon, PlusIcon, BotIcon, ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MeetingStatus } from "../../types";

const STATUS_CONFIG: Record<string, { label: string; dot: string; bg: string; text: string }> = {
  [MeetingStatus.Upcoming]:   { label: "Upcoming",   dot: "#CAFF02", bg: "bg-[#CAFF02]/10", text: "text-[#CAFF02]" },
  [MeetingStatus.Active]:     { label: "Active",     dot: "#34D399", bg: "bg-emerald-400/10", text: "text-emerald-400" },
  [MeetingStatus.Completed]:  { label: "Completed",  dot: "#34D399", bg: "bg-emerald-400/10", text: "text-emerald-400" },
  [MeetingStatus.Processing]: { label: "Processing", dot: "#818CF8", bg: "bg-violet-400/10",  text: "text-violet-400" },
  [MeetingStatus.Cancelled]:  { label: "Cancelled",  dot: "#FF4444", bg: "bg-red-500/10",     text: "text-red-400" },
};

export const MeetingsView = () => {
  const trpc = useTRPC();
  const router = useRouter();
  const [filters, setFilters] = useMeetingsFilters();

  const { data } = useSuspenseQuery(
    trpc.meetings.getMany.queryOptions({ ...filters })
  );

  if (data.items.length === 0) {
    return (
      <div className="flex flex-1 flex-col gap-y-4 px-4 pb-4 md:px-8">
        <div className="flex flex-col items-center justify-center rounded-xl border border-[#1E1E1E] bg-[#111111] py-20 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#1A1A1A]">
            <ClockIcon className="h-5 w-5 text-[#6B6B6B]" />
          </div>
          <p className="text-sm font-semibold text-[#F5F5F5]">No meetings yet</p>
          <p className="mt-1 max-w-xs text-xs text-[#6B6B6B]">
            Create your first meeting to start conducting AI-powered interviews.
          </p>
          <div className="mt-6 flex gap-3">
            <Button
              onClick={() => router.push("/meetings")}
              className="rounded-md bg-[#CAFF02] text-sm font-semibold text-black hover:bg-[#B8E602] transition-colors"
            >
              <PlusIcon className="mr-1.5 h-4 w-4" />
              New Meeting
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-md border-[#2A2A2A] bg-transparent text-[#F5F5F5] hover:bg-[#1A1A1A] transition-colors"
            >
              <Link href="/agents">
                <BotIcon className="mr-1.5 h-4 w-4" />
                Manage Agents
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-y-4 px-4 pb-4 md:px-8">
      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-[#1E1E1E] bg-[#111111]">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#1E1E1E] hover:bg-transparent">
              <TableHead className="h-10 pl-5 text-[11px] font-semibold uppercase tracking-widest text-[#6B6B6B]">
                Meeting
              </TableHead>
              <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-widest text-[#6B6B6B]">
                Agent
              </TableHead>
              <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-widest text-[#6B6B6B]">
                Status
              </TableHead>
              <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-widest text-[#6B6B6B]">
                Date
              </TableHead>
              <TableHead className="h-10 w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.items.map((item) => {
              const cfg = STATUS_CONFIG[item.status] ?? {
                label: item.status,
                dot: "#6B6B6B",
                bg: "bg-[#1A1A1A]",
                text: "text-[#6B6B6B]",
              };
              return (
                <TableRow
                  key={item.id}
                  onClick={() => router.push(`/meetings/${item.id}`)}
                  className="cursor-pointer border-b border-[#1E1E1E] transition-colors hover:bg-[#1A1A1A] last:border-0"
                >
                  {/* Meeting name */}
                  <TableCell className="py-3 pl-5 pr-4">
                    <span className="text-sm font-medium capitalize text-[#F5F5F5]">
                      {item.name}
                    </span>
                  </TableCell>

                  {/* Agent */}
                  <TableCell className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1E1E1E]">
                        <span className="text-[10px] font-bold text-[#CAFF02]">
                          {item.agent.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm capitalize text-[#9B9B9B]">
                        {item.agent.name}
                      </span>
                    </div>
                  </TableCell>

                  {/* Status badge */}
                  <TableCell className="py-3 pr-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${cfg.bg} ${cfg.text}`}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: cfg.dot }}
                      />
                      {cfg.label}
                    </span>
                  </TableCell>

                  {/* Date */}
                  <TableCell className="py-3 pr-4">
                    <span className="text-sm tabular-nums text-[#6B6B6B]">
                      {item.startedAt
                        ? format(item.startedAt, "MMM d, yyyy")
                        : "—"}
                    </span>
                  </TableCell>

                  {/* Arrow */}
                  <TableCell className="py-3 pr-4 text-right">
                    <ArrowUpRightIcon className="ml-auto h-4 w-4 text-[#3A3A3A] transition-colors group-hover:text-[#CAFF02]" />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Footer: count + pagination */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-[#6B6B6B]">
          {data.items.length} of {data.total ?? data.items.length} meetings
        </p>
        <DataPagination
          page={filters.page}
          totalPages={data.totalPages}
          onPageChange={(page) => setFilters({ page })}
        />
      </div>
    </div>
  );
};

export const MeetingsViewLoading = () => {
  return (
    <div className="flex flex-1 flex-col gap-y-4 px-4 pb-4 md:px-8">
      <div className="overflow-hidden rounded-xl border border-[#1E1E1E] bg-[#111111]">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#1E1E1E] hover:bg-transparent">
              {["Meeting", "Agent", "Status", "Date"].map((h) => (
                <TableHead key={h} className="h-10 text-[11px] font-semibold uppercase tracking-widest text-[#6B6B6B] first:pl-5">
                  {h}
                </TableHead>
              ))}
              <TableHead className="h-10 w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 7 }).map((_, i) => (
              <TableRow key={i} className="border-b border-[#1E1E1E] last:border-0 hover:bg-transparent">
                <TableCell className="py-3 pl-5 pr-4">
                  <div className="h-4 w-44 animate-pulse rounded bg-[#1A1A1A]" />
                </TableCell>
                <TableCell className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 animate-pulse rounded-full bg-[#1A1A1A]" />
                    <div className="h-3.5 w-28 animate-pulse rounded bg-[#1A1A1A]" />
                  </div>
                </TableCell>
                <TableCell className="py-3 pr-4">
                  <div className="h-5 w-20 animate-pulse rounded-full bg-[#1A1A1A]" />
                </TableCell>
                <TableCell className="py-3 pr-4">
                  <div className="h-3.5 w-24 animate-pulse rounded bg-[#1A1A1A]" />
                </TableCell>
                <TableCell className="py-3 pr-4" />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export const MeetingsViewError = () => {
  return (
    <div className="flex flex-1 items-center justify-center px-4 pb-4 md:px-8">
      <div className="rounded-xl border border-[#1E1E1E] bg-[#111111] px-10 py-14 text-center">
        <p className="font-[family-name:var(--font-display)] text-lg font-bold text-[#F5F5F5]">
          Error loading meetings
        </p>
        <p className="mt-2 text-sm text-[#6B6B6B]">Something went wrong. Please refresh.</p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="mt-5 rounded-md border-[#2A2A2A] bg-transparent text-[#F5F5F5] hover:bg-[#1A1A1A] transition-colors"
        >
          Refresh
        </Button>
      </div>
    </div>
  );
};
