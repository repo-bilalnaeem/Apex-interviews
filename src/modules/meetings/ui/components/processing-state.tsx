import { LoaderIcon } from "lucide-react";

export const ProcessingState = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-[#2A2A2A] bg-[#141414] px-6 py-14 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#818CF8]/10">
        <LoaderIcon className="h-8 w-8 animate-spin text-[#CAFF02]" />
      </div>
      <div>
        <p className="font-[family-name:var(--font-display)] text-xl font-bold text-white">
          Generating your AI debrief…
        </p>
        <p className="mt-1.5 text-sm text-[#6B6B6B]">
          This usually takes a minute. The page will update automatically.
        </p>
      </div>
    </div>
  );
};
