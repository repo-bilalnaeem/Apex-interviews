"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";

const MeetingsSearchFilter = () => {
  const [filters, setFilters] = useMeetingsFilters();

  return (
    <div className="relative">
      <SearchIcon className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#6B6B6B]" />
      <Input
        placeholder="Search meetings..."
        className="h-9 w-[200px] rounded-md border-[#1E1E1E] bg-[#111111] pl-8 text-sm text-[#F5F5F5] placeholder:text-[#6B6B6B] focus-visible:border-[#CAFF02]/30 focus-visible:ring-0"
        value={filters.search}
        onChange={(e) => setFilters({ search: e.target.value })}
      />
    </div>
  );
};

export default MeetingsSearchFilter;