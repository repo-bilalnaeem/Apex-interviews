import { Button } from "@/components/ui/button";
import { VideoIcon } from "lucide-react";
import Link from "next/link";

interface Props {
  meetingId: string;
}

export const UpComingState = ({ meetingId }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 rounded-2xl border border-[#2A2A2A] bg-[#141414] px-6 py-14 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#CAFF02]/10">
        <VideoIcon className="h-8 w-8 text-[#CAFF02]" />
      </div>
      <div>
        <p className="font-[family-name:var(--font-display)] text-xl font-bold text-white">
          Not started yet
        </p>
        <p className="mt-1.5 text-sm text-[#6B6B6B]">
          Once you start this meeting, a summary will appear here.
        </p>
      </div>
      <Button
        asChild
        className="h-10 rounded-md bg-[#CAFF02] px-6 font-[family-name:var(--font-display)] text-sm font-bold text-black hover:bg-[#A8D900] active:scale-[0.97] transition-all duration-150"
      >
        <Link href={`/call/${meetingId}`}>
          <VideoIcon className="mr-2 h-4 w-4" />
          Join Interview
        </Link>
      </Button>
    </div>
  );
};
