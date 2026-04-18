import Link from "next/link";
import Markdown from "react-markdown";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpenTextIcon,
  ClockFadingIcon,
  FileTextIcon,
  FileVideoIcon,
  SparklesIcon,
} from "lucide-react";
import React from "react";
import { MeetingGetOne } from "../../types";
import GeneratedAvatar from "@/components/generated-avatar";
import { format } from "date-fns";
import { formatDuration } from "@/lib/utils";
import { Transcript } from "./Transcript";
import { ChatProvider } from "./chat-provider";

interface Props {
  data: MeetingGetOne;
}

const CompletedState = ({ data }: Props) => {
  return (
    <div className="flex flex-col gap-y-4">
      <Tabs defaultValue="summary">
        {/* Tab bar */}
        <div className="rounded-xl border border-[#2A2A2A] bg-[#141414]">
          <ScrollArea>
            <TabsList className="h-12 w-full justify-start gap-0 rounded-none bg-transparent p-0">
              {[
                { value: "summary",    label: "Summary",    icon: BookOpenTextIcon },
                { value: "transcript", label: "Transcript", icon: FileTextIcon },
                { value: "recording",  label: "Recording",  icon: FileVideoIcon },
                { value: "chat",       label: "Ask AI",     icon: SparklesIcon },
              ].map(({ value, label, icon: Icon }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="h-full rounded-none border-b-2 border-transparent bg-transparent px-4 text-[#6B6B6B] transition-colors duration-150 data-[state=active]:border-b-[#CAFF02] data-[state=active]:text-white data-[state=active]:shadow-none hover:text-[#F5F5F5]"
                >
                  <Icon className="mr-1.5 h-4 w-4" />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {/* Summary */}
        <TabsContent value="summary">
          <div className="rounded-xl border border-[#2A2A2A] bg-[#141414]" style={{ borderTopWidth: 2, borderTopColor: "#CAFF02" }}>
            <div className="flex flex-col gap-y-5 px-6 py-6">
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold capitalize text-white">
                {data.name}
              </h2>

              <div className="flex flex-wrap items-center gap-3 text-sm text-[#6B6B6B]">
                <Link
                  href={`agents/${data.agent.id}`}
                  className="flex items-center gap-x-2 capitalize underline-offset-4 hover:text-[#F5F5F5] transition-colors duration-150"
                >
                  <GeneratedAvatar
                    variant="botttsNeutral"
                    seed={data.agent.name}
                    className="size-5"
                  />
                  {data.agent.name}
                </Link>
                {data.startedAt && (
                  <span>{format(data.startedAt, "PPP")}</span>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-1.5 rounded-xl border border-[#2A2A2A] bg-[#1E1E1E] px-3 py-1.5 text-xs text-[#6B6B6B]">
                  <SparklesIcon className="h-3.5 w-3.5 text-[#818CF8]" />
                  General summary
                </div>
                <div className="flex items-center gap-1.5 rounded-xl border border-[#2A2A2A] bg-[#1E1E1E] px-3 py-1.5 text-xs text-[#6B6B6B]">
                  <ClockFadingIcon className="h-3.5 w-3.5 text-[#818CF8]" />
                  {data.duration ? formatDuration(data.duration) : "No duration"}
                </div>
              </div>

              {/* Markdown prose */}
              <div className="text-[#F5F5F5]">
                <Markdown
                  components={{
                    h1: (props) => (
                      <h1 className="mb-4 font-[family-name:var(--font-display)] text-2xl font-bold text-white" {...props} />
                    ),
                    h2: (props) => (
                      <h2 className="mb-4 font-[family-name:var(--font-display)] text-xl font-bold text-white" {...props} />
                    ),
                    h3: (props) => (
                      <h3 className="mb-3 font-[family-name:var(--font-display)] text-lg font-bold text-white" {...props} />
                    ),
                    h4: (props) => (
                      <h4 className="mb-3 font-[family-name:var(--font-display)] text-base font-bold text-white" {...props} />
                    ),
                    p: (props) => (
                      <p className="mb-4 text-sm leading-relaxed text-[#F5F5F5]" {...props} />
                    ),
                    ul: (props) => (
                      <ul className="mb-4 list-inside list-disc text-sm text-[#F5F5F5]" {...props} />
                    ),
                    ol: (props) => (
                      <ol className="mb-4 list-inside list-decimal text-sm text-[#F5F5F5]" {...props} />
                    ),
                    li: (props) => <li className="mb-1 text-[#F5F5F5]" {...props} />,
                    strong: (props) => (
                      <strong className="font-semibold text-white" {...props} />
                    ),
                    code: (props) => (
                      <code
                        className="rounded bg-[#0A0A0A] px-1.5 py-0.5 text-xs text-[#CAFF02]"
                        {...props}
                      />
                    ),
                    blockquote: (props) => (
                      <blockquote
                        className="my-4 border-l-2 border-[#CAFF02] pl-4 italic text-[#6B6B6B]"
                        {...props}
                      />
                    ),
                  }}
                >
                  {data.summary}
                </Markdown>
              </div>

              {/* Speech Analysis */}
              {data.speechAnalysis && (
                <div className="mt-4 rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] p-4">
                  <h3 className="mb-3 font-[family-name:var(--font-display)] text-sm font-semibold text-white">
                    Speech Analysis
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {/* WPM */}
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-[#6B6B6B]">Speaking Pace</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-white">
                          {data.speechAnalysis.wpm} <span className="text-xs font-normal text-[#6B6B6B]">wpm</span>
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            data.speechAnalysis.wpmLabel === 'good'
                              ? 'bg-[#CAFF02]/10 text-[#CAFF02]'
                              : data.speechAnalysis.wpmLabel === 'too fast'
                              ? 'bg-red-500/10 text-red-400'
                              : 'bg-yellow-500/10 text-yellow-400'
                          }`}
                        >
                          {data.speechAnalysis.wpmLabel}
                        </span>
                      </div>
                      <span className="text-xs text-[#6B6B6B]">
                        {data.speechAnalysis.wpmLabel === 'too fast'
                          ? 'Try slowing down — aim for 120–180 wpm'
                          : data.speechAnalysis.wpmLabel === 'too slow'
                          ? 'Try speaking a bit faster — aim for 120–180 wpm'
                          : 'Good pace for an interview'}
                      </span>
                    </div>

                    {/* Filler words */}
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-[#6B6B6B]">Filler Words</span>
                      <span className="text-lg font-bold text-white">
                        {data.speechAnalysis.fillerWords.total}
                        <span className="ml-1 text-xs font-normal text-[#6B6B6B]">detected</span>
                      </span>
                      {data.speechAnalysis.fillerWords.total > 0 && (
                        <span className="text-xs text-[#6B6B6B]">
                          {Object.entries(data.speechAnalysis.fillerWords.breakdown)
                            .map(([word, count]) => `"${word}" ×${count}`)
                            .join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Transcript */}
        <TabsContent value="transcript">
          <Transcript meetingId={data.id} />
        </TabsContent>

        {/* Recording */}
        <TabsContent value="recording">
          <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-4">
            <video
              src={data.recordingUrl!}
              className="w-full rounded-lg"
              controls
            />
          </div>
        </TabsContent>

        {/* Ask AI */}
        <TabsContent value="chat">
          <ChatProvider meetingId={data.id} meetingName={data.name} summary={data.summary ?? undefined} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompletedState;
