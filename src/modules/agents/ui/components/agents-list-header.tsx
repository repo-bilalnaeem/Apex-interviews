"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import React, { useState } from "react";
import NewAgentDialog from "./new-agent-dialog";
import { useAgentsFilters } from "@/modules/hooks/use-agents-filters";
import AgentsSearchFilter from "./agents-search-filter";
import { DEFAULT_PAGE } from "@/constants";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const AgentListHeader = () => {
  const [filters, setFilters] = useAgentsFilters();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isAnyFilterModified = !!filters.search;

  const onClearFilters = () => {
    setFilters({ search: "", page: DEFAULT_PAGE });
  };

  return (
    <>
      <NewAgentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <div className="flex flex-col gap-y-4 px-4 py-4 md:px-8">
        {/* Title + button */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-[family-name:var(--font-display)] text-[28px] font-bold tracking-widest text-white">
            AGENTS
          </h1>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="h-9 rounded-md bg-[#CAFF02] font-[family-name:var(--font-display)] text-sm font-bold text-black hover:bg-[#A8D900] active:scale-[0.97] transition-all duration-150 sm:w-auto"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            New Agent
          </Button>
        </div>

        {/* Search filter */}
        <ScrollArea className="w-full">
          <div className="flex items-center gap-2 px-1 py-1">
            <AgentsSearchFilter />
            {isAnyFilterModified && (
              <Button
                variant="outline"
                size="sm"
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

export default AgentListHeader;
