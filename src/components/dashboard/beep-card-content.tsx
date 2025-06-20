
"use client";
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SendIcon, XCircleIcon, MagicWandIcon } from '@/components/icons';
import { useBeepStore } from '@/stores/beep.store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface BeepCardContentProps {
  aiPromptPlaceholder?: string;
}

const BeepCardContent: React.FC<BeepCardContentProps> = ({ 
  aiPromptPlaceholder = "Ask BEEP anything..." 
}) => {
  const { 
    aiPrompt, 
    setAiPrompt, 
    aiResponse, 
    isAiLoading, 
    submitPrompt, 
    clearResponse 
  } = useBeepStore();

  const handleSubmit = () => {
    // The backend API handles cases where system snapshot data isn't provided.
    submitPrompt();
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-grow flex flex-col">
        <Textarea
          placeholder={aiPromptPlaceholder}
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          onKeyPress={handleKeyPress}
          rows={2}
          className="bg-input border-input placeholder:text-muted-foreground text-sm mb-2 resize-none"
          aria-label="BEEP prompt input"
        />
        <div className="flex items-center space-x-2 mb-3">
          <Button 
            onClick={handleSubmit} 
            disabled={isAiLoading || !aiPrompt.trim()} 
            size="sm" 
            className="flex-1 btn-gradient-primary-accent"
          >
            <SendIcon className="w-4 h-4 mr-2" />
            {isAiLoading ? 'BEEP Processing...' : 'Send to BEEP'}
          </Button>
          {aiResponse && !isAiLoading && (
            <Button variant="ghost" size="icon" onClick={clearResponse} className="text-muted-foreground hover:text-destructive">
              <XCircleIcon className="w-5 h-5" />
            </Button>
          )}
        </div>
        
        {isAiLoading && !aiResponse && (
          <div className="flex-grow flex flex-col items-center justify-center text-muted-foreground p-4">
            <MagicWandIcon className="w-10 h-10 mb-3 animate-pulse text-primary" />
            <p className="text-sm">BEEP is thinking...</p>
            <p className="text-xs">Analyzing context and preparing response.</p>
          </div>
        )}

        {aiResponse && (
          <Card className="mt-0 flex-grow glassmorphism-panel">
            <CardHeader className="py-2">
              <CardTitle className="text-sm font-headline text-primary flex items-center">
                <MagicWandIcon className="w-4 h-4 mr-2 text-secondary" /> BEEP Response
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-1 pb-2 text-sm">
              <ScrollArea className="h-[100px] pr-2"> 
                <div className="whitespace-pre-wrap text-foreground">
                  {aiResponse}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
        
        {!aiResponse && !isAiLoading && (
          <div className="flex-grow flex items-center justify-center text-muted-foreground text-center p-4">
            <p className="text-sm">BEEP's responses will appear here. <br /> It learns from your interactions across the OS.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BeepCardContent;
