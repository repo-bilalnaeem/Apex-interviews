"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import React, { useState } from "react";
import NewMeetingDialog from "./new-meeting-dialog";
import MeetingsSearchFilter from "./meetings-search-filter";
import { StatusFilter } from "./status-filter";
import { AgentIdFilter } from "./agent-id-filter";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DEFAULT_PAGE } from "@/constants";

const MeetingsListHeader = () => {
  const [filters, setFilters] = useMeetingsFilters();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isAnyFilterModified =
    !!filters.status || !!filters.search || !!filters.agentId;

  const onClearFilters = () => {
    setFilters({
      status: null,
      agentId: "",
      search: "",
      page: DEFAULT_PAGE,
    });
  };

  return (
    <>
      <NewMeetingDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />

      <div className="flex flex-col gap-y-4 px-4 py-4 md:px-8">
        {/* Title + actions */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-[family-name:var(--font-display)] text-[28px] font-bold tracking-widest text-white">
            MEETINGS
          </h1>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="h-9 rounded-md bg-[#CAFF02] font-[family-name:var(--font-display)] text-sm font-bold text-black hover:bg-[#A8D900] active:scale-[0.97] transition-all duration-150"
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              New Meeting
            </Button>
          </div>
        </div>

        {/* Filters */}
        <ScrollArea>
          <div className="flex flex-wrap items-center gap-2 p-1 sm:flex-nowrap">
            <MeetingsSearchFilter />
            <StatusFilter />
            <AgentIdFilter />
            {isAnyFilterModified && (
              <Button
                variant="outline"
                onClick={onClearFilters}
                className="flex h-9 items-center gap-1 whitespace-nowrap rounded-md border-[#2A2A2A] bg-[#1E1E1E] text-[#9B9B9B] hover:border-[#CAFF02]/30 hover:bg-[#252525] hover:text-[#F5F5F5] transition-all duration-150"
              >
                <XCircleIcon className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
};

export default MeetingsListHeader;
