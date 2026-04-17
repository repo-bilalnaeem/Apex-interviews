"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

import { useTRPC } from "@/trpc/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";

export const AgentIdFilter = () => {
  const [filters, setFilters] = useMeetingsFilters();
  const [open, setOpen] = useState(false);
  const [agentSearch, setAgentSearch] = useState("");

  const trpc = useTRPC();
  const { data } = useQuery(
    trpc.agents.getMany.queryOptions({ pageSize: 100, search: agentSearch })
  );

  const selectedAgent = data?.items.find((a) => a.id === filters.agentId);

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        if (!o) setAgentSearch("");
        setOpen(o);
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-[160px] justify-between rounded-md border-[#1E1E1E] bg-[#111111] px-3 font-normal hover:bg-[#1A1A1A]"
        >
          <span
            className={cn(
              "truncate text-sm",
              selectedAgent ? "text-[#F5F5F5]" : "text-[#6B6B6B]"
            )}
          >
            {selectedAgent?.name ?? "Agent"}
          </span>
          <ChevronDownIcon className="ml-1 size-3.5 shrink-0 text-[#6B6B6B]" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[220px] rounded-md border-[#1E1E1E] bg-[#111111] p-0"
      >
        <Command className="bg-transparent">
          <CommandInput
            placeholder="Search agents..."
            value={agentSearch}
            onValueChange={setAgentSearch}
            className="border-b border-[#1E1E1E] text-[#F5F5F5] placeholder:text-[#6B6B6B]"
          />
          <CommandList>
            <CommandEmpty className="py-4 text-center text-xs text-[#6B6B6B]">
              No agents found.
            </CommandEmpty>
            {data?.items.map((agent) => (
              <CommandItem
                key={agent.id}
                onSelect={() => {
                  setFilters({
                    agentId: agent.id === filters.agentId ? "" : agent.id,
                  });
                  setAgentSearch("");
                  setOpen(false);
                }}
                className="cursor-pointer text-[#9B9B9B] data-[selected=true]:bg-[#1A1A1A] data-[selected=true]:text-[#F5F5F5]"
              >
                <span className="truncate">{agent.name}</span>
                {filters.agentId === agent.id && (
                  <CheckIcon className="ml-auto size-3.5 text-[#CAFF02]" />
                )}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
