import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(page: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  if (page > 3) pages.push("…");
  for (let p = Math.max(2, page - 1); p <= Math.min(total - 1, page + 1); p++) {
    pages.push(p);
  }
  if (page < total - 2) pages.push("…");
  pages.push(total);
  return pages;
}

const DataPagination = ({ page, totalPages, onPageChange }: Props) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-1">
      <button
        disabled={page === 1}
        onClick={() => onPageChange(Math.max(1, page - 1))}
        className="flex h-8 items-center gap-1 rounded-md border border-[#1E1E1E] bg-transparent px-2.5 text-xs text-[#6B6B6B] transition-colors hover:border-[#2A2A2A] hover:bg-[#1A1A1A] hover:text-[#F5F5F5] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeftIcon className="size-3.5" />
        <span>Prev</span>
      </button>

      {getPageNumbers(page, totalPages).map((p, i) =>
        p === "…" ? (
          <span
            key={`ellipsis-${i}`}
            className="flex h-8 w-8 items-center justify-center text-xs text-[#3A3A3A]"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium transition-colors",
              p === page
                ? "bg-[#CAFF02] text-black"
                : "text-[#6B6B6B] hover:bg-[#1A1A1A] hover:text-[#F5F5F5]"
            )}
          >
            {p}
          </button>
        )
      )}

      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        className="flex h-8 items-center gap-1 rounded-md border border-[#1E1E1E] bg-transparent px-2.5 text-xs text-[#6B6B6B] transition-colors hover:border-[#2A2A2A] hover:bg-[#1A1A1A] hover:text-[#F5F5F5] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <span>Next</span>
        <ChevronRightIcon className="size-3.5" />
      </button>
    </div>
  );
};

export default DataPagination;
