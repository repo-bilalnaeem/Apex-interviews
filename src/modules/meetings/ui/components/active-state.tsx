import { Button } from "@/components/ui/button";
import { VideoIcon } from "lucide-react";
import Link from "next/link";

interface Props {
  meetingId: string;
}

export const ActiveState = ({ meetingId }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 rounded-2xl border border-[#2A2A2A] bg-[#141414] px-6 py-14 text-center">
      {/* Pulsing green indicator */}
      <div className="relative flex h-16 w-16 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34D399] opacity-20 motion-safe:animate-ping" />
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#34D399]/15">
          <VideoIcon className="h-6 w-6 text-[#34D399]" />
        </div>
      </div>
      <div>
        <div className="flex items-center justify-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#34D399]" />
          <p className="font-[family-name:var(--font-display)] text-xl font-bold text-white">
            In Progress
          </p>
        </div>
        <p className="mt-1.5 text-sm text-[#6B6B6B]">
          Meeting will end once all participants have left.
        </p>
      </div>
      <Button
        asChild
        className="h-10 rounded-md bg-[#CAFF02] px-6 font-[family-name:var(--font-display)] text-sm font-bold text-black hover:bg-[#A8D900] active:scale-[0.97] transition-all duration-150"
      >
        <Link href={`/call/${meetingId}`}>
          <VideoIcon className="mr-2 h-4 w-4" />
          Rejoin
        </Link>
      </Button>
    </div>
  );
};
