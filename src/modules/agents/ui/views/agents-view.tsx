"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useAgentsFilters } from "@/modules/hooks/use-agents-filters";
import DataPagination from "../components/data-pagination";
import { useRouter } from "next/navigation";
import { PlusIcon, LayoutGridIcon, ListIcon, ArrowUpRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import NewAgentDialog from "../components/new-agent-dialog";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ViewMode = "grid" | "table";

const AgentsView = () => {
  const router = useRouter();
  const [filters, setFilters] = useAgentsFilters();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.agents.getMany.queryOptions({ ...filters })
  );

  const isEmpty = data.items.length === 0 && !filters.search;

  return (
    <>
      <NewAgentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <div className="flex flex-1 flex-col gap-y-4 px-4 pb-4 md:px-8">
        {isEmpty ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center rounded-xl border border-[#1E1E1E] bg-[#111111] py-20 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#1A1A1A]">
              <PlusIcon className="h-5 w-5 text-[#CAFF02]" />
            </div>
            <p className="text-sm font-semibold text-[#F5F5F5]">No agents yet</p>
            <p className="mt-1 max-w-xs text-xs text-[#6B6B6B]">
              Create your first AI agent to start conducting interviews.
            </p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="mt-6 rounded-md bg-[#CAFF02] text-sm font-semibold text-black hover:bg-[#B8E602] transition-colors"
            >
              <PlusIcon className="mr-1.5 h-4 w-4" />
              New Agent
            </Button>
          </div>
        ) : (
          <>
            {/* View toggle */}
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#6B6B6B]">
                {data.items.length} agent{data.items.length !== 1 ? "s" : ""}
              </p>
              <div className="flex items-center gap-1 rounded-lg border border-[#1E1E1E] bg-[#111111] p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
                    viewMode === "grid"
                      ? "bg-[#CAFF02] text-black"
                      : "text-[#6B6B6B] hover:text-[#F5F5F5]"
                  }`}
                  title="Grid view"
                >
                  <LayoutGridIcon className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
                    viewMode === "table"
                      ? "bg-[#CAFF02] text-black"
                      : "text-[#6B6B6B] hover:text-[#F5F5F5]"
                  }`}
                  title="Table view"
                >
                  <ListIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {viewMode === "grid" ? (
              /* Grid view */
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {data.items.map((agent) => (
                  <button
                    key={agent.id}
                    onClick={() => router.push(`/agents/${agent.id}`)}
                    className="group flex items-center gap-4 rounded-xl border border-[#1E1E1E] bg-[#111111] px-4 py-3.5 text-left hover:border-[#2A2A2A] hover:bg-[#1A1A1A] transition-all duration-150"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1A1A1A]">
                      <span className="font-[family-name:var(--font-display)] text-lg font-bold text-[#CAFF02]">
                        {agent.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium capitalize text-[#F5F5F5]">
                        {agent.name}
                      </p>
                      <p className="mt-0.5 text-xs text-[#6B6B6B]">
                        {agent.meetingCount} {agent.meetingCount === 1 ? "meeting" : "meetings"}
                      </p>
                    </div>
                    <ArrowUpRightIcon className="h-4 w-4 shrink-0 text-[#3A3A3A] transition-colors group-hover:text-[#CAFF02]" />
                  </button>
                ))}
                {/* New agent card */}
                <button
                  onClick={() => setIsDialogOpen(true)}
                  className="flex items-center gap-4 rounded-xl border border-dashed border-[#1E1E1E] bg-transparent px-4 py-3.5 text-left hover:border-[#CAFF02]/30 hover:bg-[#111111] transition-all duration-150"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-dashed border-[#2A2A2A]">
                    <PlusIcon className="h-4 w-4 text-[#CAFF02]" />
                  </div>
                  <span className="text-sm text-[#6B6B6B]">New Agent</span>
                </button>
              </div>
            ) : (
              /* Table view */
              <div className="overflow-hidden rounded-xl border border-[#1E1E1E] bg-[#111111]">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-[#1E1E1E] hover:bg-transparent">
                      <TableHead className="h-10 pl-5 text-[11px] font-semibold uppercase tracking-widest text-[#6B6B6B]">
                        Agent
                      </TableHead>
                      <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-widest text-[#6B6B6B]">
                        Meetings
                      </TableHead>
                      <TableHead className="h-10 w-10" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.items.map((agent) => (
                      <TableRow
                        key={agent.id}
                        onClick={() => router.push(`/agents/${agent.id}`)}
                        className="cursor-pointer border-b border-[#1E1E1E] transition-colors hover:bg-[#1A1A1A] last:border-0"
                      >
                        <TableCell className="py-3 pl-5 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1A1A1A]">
                              <span className="font-[family-name:var(--font-display)] text-sm font-bold text-[#CAFF02]">
                                {agent.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="text-sm font-medium capitalize text-[#F5F5F5]">
                              {agent.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 pr-4">
                          <span className="inline-flex items-center rounded-full bg-[#1A1A1A] px-2.5 py-0.5 text-[11px] font-medium text-[#9B9B9B]">
                            {agent.meetingCount} {agent.meetingCount === 1 ? "meeting" : "meetings"}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 pr-4 text-right">
                          <ArrowUpRightIcon className="ml-auto h-4 w-4 text-[#3A3A3A]" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </>
        )}

        {data.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#6B6B6B]">
              {data.items.length} of {data.total ?? data.items.length} agents
            </p>
            <DataPagination
              page={filters.page}
              totalPages={data.totalPages}
              onPageChange={(page) => setFilters({ page })}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default AgentsView;

export const AgentsViewLoading = () => {
  return (
    <div className="flex flex-1 flex-col gap-y-4 px-4 pb-4 md:px-8">
      <div className="flex items-center justify-between">
        <div className="h-3 w-16 animate-pulse rounded bg-[#1A1A1A]" />
        <div className="h-9 w-20 animate-pulse rounded-lg bg-[#1A1A1A]" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-xl border border-[#1E1E1E] bg-[#111111] px-4 py-3.5"
          >
            <div className="h-10 w-10 animate-pulse rounded-full bg-[#1A1A1A]" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 w-28 animate-pulse rounded bg-[#1A1A1A]" />
              <div className="h-3 w-16 animate-pulse rounded bg-[#1A1A1A]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AgentsViewError = () => {
  return (
    <div className="flex flex-1 items-center justify-center px-4 pb-4 md:px-8">
      <div className="rounded-xl border border-[#1E1E1E] bg-[#111111] px-10 py-14 text-center">
        <p className="font-[family-name:var(--font-display)] text-lg font-bold text-[#F5F5F5]">
          Error loading agents
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
