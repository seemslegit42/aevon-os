
"use client";
import React, { useEffect, useRef } from 'react';
import { useChat } from 'ai/react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SendIcon, MagicWandIcon, UserIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import eventBus from '@/lib/event-bus';
import type { Message } from 'ai';
import { useToast } from '@/hooks/use-toast';

interface BeepCardContentProps {
  aiPromptPlaceholder?: string;
}

const BeepCardContent: React.FC<BeepCardContentProps> = ({ 
  aiPromptPlaceholder = "Ask BEEP anything..." 
}) => {
  const { toast } = useToast();

  const { messages, input, handleInputChange, handleSubmit, isLoading, append, setMessages } = useChat({
    api: '/api/ai/chat',
    experimental_onToolCall: async (toolCalls, appendToolCallMessage) => {
      for (const toolCall of toolCalls) {
        if (toolCall.toolName === 'focusPanel') {
          // Immediately emit the event to focus the panel on the dashboard
          const { cardId } = toolCall.args;
          eventBus.emit('panel:focus', cardId);
          
          // Add a result message to the chat
          appendToolCallMessage({
            toolCallId: toolCall.toolCallId,
            toolName: 'focusPanel',
            result: `Panel "${cardId}" has been brought into focus.`,
          });
        }
      }
    },
  });

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Scroll chat to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  // Listen for queries submitted from the TopBar
  useEffect(() => {
    const handleQuerySubmit = (query: string) => {
        if (query) {
            append({
                role: 'user',
                content: query,
            } as Message);
        }
    };

    eventBus.on('beep:submitQuery', handleQuerySubmit);

    return () => {
        eventBus.off('beep:submitQuery', handleQuerySubmit);
    };
  }, [append]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleSubmit(e);
    // Reset textarea height after submission
    if (inputRef.current) {
      inputRef.current.style.height = '40px';
    }
  };
  
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange(e);
    // Auto-resize logic
    if (inputRef.current) {
        inputRef.current.style.height = 'auto'; // Reset height
        inputRef.current.style.height = `${inputRef.current.scrollHeight}px`; // Set to scroll height
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      const form = event.currentTarget.closest('form');
      if (form) {
        form.requestSubmit();
      }
    }
  };

  return (
    <div className="flex flex-col h-full p-1">
      <div className="flex-grow mb-2 min-h-0">
        <ScrollArea className="h-full pr-2" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.length > 0 ? (
              messages.map(m => {
                if (m.role === 'tool') {
                  // Do not render tool messages in the chat history
                  return null;
                }
                return (
                  <div key={m.id} className={cn("flex items-start gap-3", m.role === 'user' ? 'justify-end' : '')}>
                    {m.role === 'assistant' && <MagicWandIcon className="w-5 h-5 text-primary flex-shrink-0 mt-1" />}
                    <div className={cn(
                      "p-3 rounded-lg max-w-sm whitespace-pre-wrap text-sm",
                      m.role === 'user'
                        ? 'btn-gradient-primary-accent text-primary-foreground'
                        : 'bg-muted/50 text-foreground'
                    )}>
                      {m.content}
                    </div>
                    {m.role === 'user' && <UserIcon className="w-5 h-5 text-primary flex-shrink-0 mt-1" />}
                  </div>
                )
              })
            ) : (
              <div className="flex-grow flex h-full items-center justify-center text-muted-foreground text-center">
                <p className="text-sm">BEEP's responses will appear here. <br /> Ask me to "show the loom studio".</p>
              </div>
            )}
            {isLoading && messages[messages.length-1]?.role === 'user' && (
              <div className="flex items-start gap-3">
                <MagicWandIcon className="w-5 h-5 text-primary flex-shrink-0 mt-1 animate-pulse" />
                <div className="p-3 rounded-lg bg-muted/50 text-foreground text-sm">...</div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <form onSubmit={handleFormSubmit} className="flex-shrink-0">
        <div className="relative">
          <Textarea
            ref={inputRef}
            placeholder={aiPromptPlaceholder}
            value={input}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyPress}
            rows={1}
            className="bg-input border-input placeholder:text-muted-foreground text-sm pr-12 min-h-[40px] max-h-[150px] overflow-y-auto"
            aria-label="BEEP prompt input"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            size="icon"
            className="absolute bottom-2 right-2 h-8 w-8 btn-gradient-primary-accent"
          >
            <SendIcon className="w-4 h-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BeepCardContent;
