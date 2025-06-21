
"use client";
import React, { useEffect, useRef } from 'react';
import { useChat } from 'ai/react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SendIcon, MagicWandIcon, UserIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface BeepCardContentProps {
  aiPromptPlaceholder?: string;
}

const BeepCardContent: React.FC<BeepCardContentProps> = ({ 
  aiPromptPlaceholder = "Ask BEEP anything..." 
}) => {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/ai/chat'
  });

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleSubmit(e);
  };
  
  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      // Manually create a form event to pass to the hook's handleSubmit
      const form = event.currentTarget.closest('form');
      if (form) {
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      }
    }
  };

  return (
    <div className="flex flex-col h-full p-1">
      <div className="flex-grow mb-2 min-h-0">
        <ScrollArea className="h-full pr-2" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.length > 0 ? (
              messages.map(m => (
                <div key={m.id} className={cn("flex items-start gap-3", m.role === 'user' ? 'justify-end' : '')}>
                  {m.role === 'assistant' && <MagicWandIcon className="w-5 h-5 text-primary flex-shrink-0 mt-1" />}
                  <div className={cn(
                    "p-3 rounded-lg max-w-sm whitespace-pre-wrap text-sm",
                    m.role === 'user'
                      ? 'bg-primary/80 text-primary-foreground'
                      : 'bg-muted/50 text-foreground'
                  )}>
                    {m.content}
                  </div>
                  {m.role === 'user' && <UserIcon className="w-5 h-5 text-primary flex-shrink-0 mt-1" />}
                </div>
              ))
            ) : (
              <div className="flex-grow flex h-full items-center justify-center text-muted-foreground text-center">
                <p className="text-sm">BEEP's responses will appear here. <br /> It learns from your interactions across the OS.</p>
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
            placeholder={aiPromptPlaceholder}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            rows={1}
            className="bg-input border-input placeholder:text-muted-foreground text-sm pr-20 resize-none min-h-[40px]"
            aria-label="BEEP prompt input"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={isLoading || !input.trim()} 
            size="sm" 
            className="absolute right-2 top-1/2 -translate-y-1/2 btn-gradient-primary-accent"
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
