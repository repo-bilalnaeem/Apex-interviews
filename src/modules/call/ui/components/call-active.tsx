"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { VideoIcon } from "lucide-react";
import { CallControls, SpeakerLayout } from "@stream-io/video-react-sdk";

const CALL_LIMIT_SECONDS = 60;

interface Props {
  onLeave: () => void;
  meetingName: string;
}

export const CallActive = ({ onLeave, meetingName }: Props) => {
  const [secondsLeft, setSecondsLeft] = useState(CALL_LIMIT_SECONDS);
  const onLeaveRef = useRef(onLeave);
  onLeaveRef.current = onLeave;

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onLeaveRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeDisplay = `${minutes}:${String(seconds).padStart(2, "0")}`;
  const isWarning = secondsLeft <= 15;

  return (
    <div className="flex flex-col justify-between p-4 h-full text-white">
      <div className="bg-[#101213] rounded-full p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href={"/"}
            className="flex items-center justify-center p-1 bg-white/10 rounded-full w-fit"
          >
            <VideoIcon width={22} height={22} />
          </Link>
          <h4 className="text-base">{meetingName}</h4>
        </div>
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-mono font-semibold ${
            isWarning
              ? "bg-red-500/20 text-red-400 animate-pulse"
              : "bg-white/10 text-white"
          }`}
        >
          <span className={`h-2 w-2 rounded-full ${isWarning ? "bg-red-400" : "bg-green-400"}`} />
          {timeDisplay}
        </div>
      </div>
      <SpeakerLayout />
      <div className="bg-[#101213] rounded-full px-4">
        <CallControls onLeave={onLeave} />
      </div>
    </div>
  );
};
