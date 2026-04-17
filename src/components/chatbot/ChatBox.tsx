import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { UploadIcon, CheckCircle, Send } from 'lucide-react';
import MessageBubble from './MessageBubble';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

interface ChatBoxProps {
  messages: Message[];
  loading: boolean;
  resumeUploaded: boolean;
  resumeName: string;
  handleResumeUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  input: string;
  setInput: (value: string) => void;
  sendMessage: (e: React.FormEvent) => void;
  snackbar: { open: boolean; message: string; severity: 'success' | 'error' };
  setSnackbar: (snackbar: { open: boolean; message: string; severity: 'success' | 'error' }) => void;
  onStreamMessage: (
    input: string,
    setStreaming: (streaming: boolean) => void,
    setStreamedText: (text: string) => void,
    useResume: boolean
  ) => Promise<void>;
}

export default function ChatBox({ 
  messages, 
  loading, 
  resumeUploaded, 
  resumeName, 
  handleResumeUpload, 
  input, 
  setInput, 
  sendMessage, 
  snackbar, 
  setSnackbar, 
  onStreamMessage 
}: ChatBoxProps) {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  // For streaming
  const [streaming, setStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState('');
  const [useResume, setUseResume] = useState(true);
  const [creativity, setCreativity] = useState([50]);

  // Show toast when snackbar state changes
  useEffect(() => {
    if (snackbar.open) {
      if (snackbar.severity === 'success') {
        toast.success(snackbar.message);
      } else {
        toast.error(snackbar.message);
      }
      setSnackbar({ ...snackbar, open: false });
    }
  }, [snackbar, setSnackbar]);

  // Streaming sendMessage
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    if (onStreamMessage) {
      setStreaming(true);
      setStreamedText('');
      await onStreamMessage(input, setStreaming, setStreamedText, useResume);
      setInput('');
    } else {
      sendMessage(e);
    }
  };

  return (
    <div className="w-full max-w-md h-full max-h-[600px] bg-background border rounded-lg flex flex-col overflow-hidden">
      {/* Chat area */}
      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col gap-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground mt-8">
              Start a conversation!
            </div>
          )}
          {messages.map((msg, idx) => (
            <MessageBubble key={idx} sender={msg.sender} text={msg.text} />
          ))}
          {(loading || streaming) && (
            <MessageBubble sender="bot" text={streamedText || 'AI is typing...'} />
          )}
          <div ref={chatEndRef} />
        </div>
      </ScrollArea>

      {/* Slider for AI Creativity */}
      <div className="px-4 py-2 bg-muted/30 border-t border-b flex items-center gap-4">
        <Label className="text-sm text-primary min-w-20">AI Creativity</Label>
        <Slider
          value={creativity}
          onValueChange={setCreativity}
          max={100}
          step={1}
          className="flex-1"
        />
        <span className="text-sm text-primary min-w-6 text-right">{creativity[0]}</span>
      </div>

      {/* Sticky input and uploader */}
      <div className="border-t bg-muted/30 p-4">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          {/* PDF uploader */}
          <div className="flex flex-col items-center gap-1">
            <Button
              type="button"
              variant={resumeUploaded ? "outline" : "default"}
              size="sm"
              className="min-w-0 px-2"
              asChild
            >
              <label className="cursor-pointer">
                <input 
                  type="file" 
                  accept="application/pdf" 
                  hidden 
                  onChange={handleResumeUpload} 
                />
                {resumeUploaded ? (
                  <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                ) : (
                  <UploadIcon className="w-4 h-4 mr-1" />
                )}
                {resumeUploaded && resumeName ? (
                  <span className="text-xs max-w-[90px] truncate">
                    {resumeName}
                  </span>
                ) : (
                  <span className="text-xs">PDF</span>
                )}
              </label>
            </Button>
            
            {resumeUploaded && (
              <div className="flex items-center space-x-1">
                <Checkbox 
                  id="use-resume"
                  checked={useResume} 
                  onCheckedChange={(checked) => setUseResume(checked as boolean)}
                />
                <Label htmlFor="use-resume" className="text-xs text-primary">
                  Use resume
                </Label>
              </div>
            )}
          </div>

          {/* Chat input */}
          <div className="flex-1 relative">
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading || streaming}
              className="pr-10"
            />
            <Button
              type="submit"
              size="sm"
              disabled={loading || streaming || !input.trim()}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
