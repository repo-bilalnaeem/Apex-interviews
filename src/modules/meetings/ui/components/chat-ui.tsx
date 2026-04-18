"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";

interface ChatUIProps {
  meetingId: string;
  meetingName: string;
  userId: string;
  userName: string;
  userImage: string | undefined;
  summary?: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STORAGE_KEY = (id: string) => `meeting_chat_${id}`;

const TOOL_LABELS: Record<string, string> = {
  fetch_transcript: "Fetching transcript...",
  // extensible: add future tools here
};

export const ChatUI = ({ meetingId, meetingName, summary }: ChatUIProps) => {
  const [history, setHistory] = useState<Message[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY(meetingId)) || "[]");
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState("");
  const [thinkingLabel, setThinkingLabel] = useState<string>("");
  const [activeAgent, setActiveAgent] = useState<string>("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, streamedText]);

  const sendMessage = async () => {
    if (!input.trim() || streaming) return;
    const userMessage = input.trim();
    setInput("");

    const updatedHistory: Message[] = [...history, { role: "user", content: userMessage }];
    setHistory(updatedHistory);
    setStreaming(true);
    setStreamedText("");

    // Build meeting context as the "resume" field so the API injects it into the system prompt
    const meetingContext = [
      `The user is asking about their completed interview: "${meetingName}".`,
      summary ? `Interview summary:\n${summary}` : "",
    ].filter(Boolean).join("\n\n");

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          resume: meetingContext,
          history: history, // send prior history for LangChain memory
          meetingId,        // enables transcript-grounded RAG retrieval
        }),
      });

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const lines = decoder.decode(value).split("\n").filter((l) => l.startsWith("data:"));
        for (const line of lines) {
          let parsed: { error?: string; agentName?: string; toolCall?: string; answer?: string };
          try {
            parsed = JSON.parse(line.slice(5).trim());
          } catch {
            continue; // skip malformed SSE lines
          }
          if (parsed.error) throw new Error(parsed.error);
          if (parsed.agentName) {
            setActiveAgent(parsed.agentName);
          }
          if (parsed.toolCall) {
            setThinkingLabel(TOOL_LABELS[parsed.toolCall] ?? "Looking up meeting...");
          }
          if (parsed.answer) {
            fullResponse += parsed.answer;
            setStreamedText(fullResponse);
            setThinkingLabel("");
            // Keep activeAgent set so it shows during streaming
          }
        }
      }

      const newHistory: Message[] = [...updatedHistory, { role: "assistant", content: fullResponse }];
      setHistory(newHistory);
      localStorage.setItem(STORAGE_KEY(meetingId), JSON.stringify(newHistory));
    } catch {
      const newHistory: Message[] = [...updatedHistory, { role: "assistant", content: "Sorry, something went wrong. Please try again." }];
      setHistory(newHistory);
    } finally {
      setStreaming(false);
      setStreamedText("");
      setThinkingLabel("");
      setActiveAgent("");
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY(meetingId));
  };

  return (
    <div className="flex flex-col h-[500px] rounded-xl border border-[#2A2A2A] bg-[#0A0A0A]">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-[#2A2A2A] bg-[#141414] rounded-t-xl">
        <div>
          <p className="text-sm font-semibold text-[#F5F5F5]">Ask AI about this interview</p>
          <p className="text-xs text-[#6B6B6B]">{meetingName}</p>
        </div>
        {history.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearHistory} className="text-[#6B6B6B] hover:text-red-400 h-8 w-8 p-0">
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#3A3A3A] [&::-webkit-scrollbar-thumb]:rounded-full">
        <div className="flex flex-col gap-3">
          {history.length === 0 && !streaming && (
            <p className="text-center text-[#6B6B6B] text-sm mt-8">
              Ask me anything about your interview — performance, key moments, what to improve.
            </p>
          )}
          {history.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#CAFF02] text-[#0A0A0A]"
                  : "bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F5F5]"
              }`}>
                {msg.role === "assistant" ? (
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                      li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                      strong: ({ children }) => <strong className="font-semibold text-[#CAFF02]">{children}</strong>,
                      em: ({ children }) => <em className="italic text-[#AAAAAA]">{children}</em>,
                      h1: ({ children }) => <h1 className="text-base font-bold mb-2 text-[#CAFF02]">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-sm font-bold mb-1.5 text-[#CAFF02]">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-sm font-semibold mb-1 text-[#DDDDDD]">{children}</h3>,
                      code: ({ children }) => <code className="bg-[#0A0A0A] text-[#CAFF02] px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                      blockquote: ({ children }) => <blockquote className="border-l-2 border-[#CAFF02] pl-3 text-[#AAAAAA] italic">{children}</blockquote>,
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
          {streaming && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F5F5]">
                {streamedText ? (
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                      li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                      strong: ({ children }) => <strong className="font-semibold text-[#CAFF02]">{children}</strong>,
                      em: ({ children }) => <em className="italic text-[#AAAAAA]">{children}</em>,
                      h1: ({ children }) => <h1 className="text-base font-bold mb-2 text-[#CAFF02]">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-sm font-bold mb-1.5 text-[#CAFF02]">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-sm font-semibold mb-1 text-[#DDDDDD]">{children}</h3>,
                      code: ({ children }) => <code className="bg-[#0A0A0A] text-[#CAFF02] px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                      blockquote: ({ children }) => <blockquote className="border-l-2 border-[#CAFF02] pl-3 text-[#AAAAAA] italic">{children}</blockquote>,
                    }}
                  >
                    {streamedText}
                  </ReactMarkdown>
                ) : thinkingLabel ? (
                  <div className="flex items-center gap-2">
                    {activeAgent && (
                      <span className="text-[#CAFF02] text-xs font-medium">{activeAgent}</span>
                    )}
                    <span className="text-[#6B6B6B] text-xs">{thinkingLabel}</span>
                    <div className="flex gap-1 items-center">
                      <div className="w-1.5 h-1.5 bg-[#CAFF02] rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-[#CAFF02] rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <div className="w-1.5 h-1.5 bg-[#CAFF02] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {activeAgent && (
                      <span className="text-[#CAFF02] text-xs font-medium">{activeAgent}</span>
                    )}
                    <div className="flex gap-1 items-center">
                      <div className="w-1.5 h-1.5 bg-[#CAFF02] rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-[#CAFF02] rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <div className="w-1.5 h-1.5 bg-[#CAFF02] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-[#2A2A2A] p-3 bg-[#141414] rounded-b-xl">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Ask about your interview performance..."
            disabled={streaming}
            className="flex-1 bg-[#1A1A1A] border-[#2A2A2A] text-[#F5F5F5] placeholder:text-[#6B6B6B] focus-visible:ring-[#CAFF02]"
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || streaming}
            className="bg-[#CAFF02] text-[#0A0A0A] hover:bg-[#B8E602] disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
