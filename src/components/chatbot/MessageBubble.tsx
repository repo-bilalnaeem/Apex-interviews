import React from 'react';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  sender: 'user' | 'bot';
  text: string;
}

export default function MessageBubble({ sender, text }: MessageBubbleProps) {
  return (
    <div className="animate-in fade-in-50 duration-400">
      <div
        className={cn(
          "max-w-[85%] px-4 py-3 mb-2 transition-all duration-200 whitespace-pre-line break-words",
          sender === 'user' 
            ? "self-end bg-primary text-primary-foreground rounded-[1.4em_1.4em_0.7em_1.4em] shadow-sm" 
            : "self-start bg-muted text-foreground rounded-[1.4em_1.4em_1.4em_0.7em] shadow-sm"
        )}
      >
        {text}
      </div>
    </div>
  );
}
