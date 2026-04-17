"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MeetingStatus } from "../../types";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";

const STATUS_OPTIONS = [
  { value: MeetingStatus.Upcoming,   label: "Upcoming" },
  { value: MeetingStatus.Active,     label: "Active" },
  { value: MeetingStatus.Completed,  label: "Completed" },
  { value: MeetingStatus.Processing, label: "Processing" },
  { value: MeetingStatus.Cancelled,  label: "Cancelled" },
];

export const StatusFilter = () => {
  const [filters, setFilters] = useMeetingsFilters();

  return (
    <Select
      value={filters.status ?? "__all__"}
      onValueChange={(value) =>
        setFilters({ status: value === "__all__" ? null : (value as MeetingStatus) })
      }
    >
      <SelectTrigger
        size="sm"
        className="h-9 w-[140px] rounded-md border-[#1E1E1E] bg-[#111111] text-sm text-[#9B9B9B] hover:bg-[#1A1A1A] focus:ring-0 data-[placeholder]:text-[#6B6B6B]"
      >
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent className="rounded-md border-[#1E1E1E] bg-[#111111]">
        <SelectItem
          value="__all__"
          className="text-[#6B6B6B] focus:bg-[#1A1A1A] focus:text-[#F5F5F5]"
        >
          All statuses
        </SelectItem>
        {STATUS_OPTIONS.map((opt) => (
          <SelectItem
            key={opt.value}
            value={opt.value}
            className="text-[#9B9B9B] focus:bg-[#1A1A1A] focus:text-[#F5F5F5]"
          >
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
