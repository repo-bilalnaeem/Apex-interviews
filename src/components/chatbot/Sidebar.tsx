import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';

interface Session {
  id: number;
  title: string;
  messages: Array<{ sender: 'user' | 'bot'; text: string }>;
}

interface SidebarProps {
  sessions: Session[];
  currentSessionIdx: number;
  onNewChat: () => void;
  onSelectSession: (idx: number) => void;
  newChatLabel?: string;
}

export default function Sidebar({ 
  sessions, 
  currentSessionIdx, 
  onNewChat, 
  onSelectSession, 
  newChatLabel = 'New Chat' 
}: SidebarProps) {
  return (
    <div className="w-40 h-[600px] max-h-[750px] bg-background border-r border-border flex flex-col py-2 px-0">
      <div className="flex justify-center mb-2">
        <Button 
          onClick={onNewChat} 
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-3 py-2 text-sm"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          {newChatLabel}
        </Button>
      </div>
      
      <Separator className="mx-auto w-4/5 mb-2" />
      
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1">
          {sessions.map((session, idx) => (
            <Button
              key={session.id}
              variant={idx === currentSessionIdx ? "secondary" : "ghost"}
              className="w-full justify-start text-left h-8 px-2 text-sm font-medium"
              onClick={() => onSelectSession(idx)}
            >
              <span className="truncate">
                {session.title || 'New Interview'}
              </span>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
