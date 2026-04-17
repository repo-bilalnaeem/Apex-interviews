import { Button } from "@/components/ui/button";
import { XCircleIcon } from "lucide-react";
import Link from "next/link";

export const CancelledState = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 rounded-2xl border border-[#2A2A2A] bg-[#141414] px-6 py-14 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FF4444]/10">
        <XCircleIcon className="h-8 w-8 text-[#FF4444]" />
      </div>
      <div>
        <div className="flex items-center justify-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#FF4444]" />
          <p className="font-[family-name:var(--font-display)] text-xl font-bold text-white">
            Meeting Cancelled
          </p>
        </div>
        <p className="mt-1.5 text-sm text-[#6B6B6B]">
          This meeting was cancelled and is no longer active.
        </p>
      </div>
      <Button
        asChild
        variant="ghost"
        className="rounded-md text-[#CAFF02] hover:bg-[#CAFF02]/10 hover:text-[#CAFF02] transition-all duration-150"
      >
        <Link href="/meetings">Create new meeting</Link>
      </Button>
    </div>
  );
};
