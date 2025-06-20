
import React, { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LoaderCircle } from 'lucide-react';

interface AiAssistantCardContentProps {
  aiPrompt: string;
  setAiPrompt: (value: string) => void;
  handleAiSubmit: (e: FormEvent) => Promise<void>;
  isAiLoading: boolean;
  aiResponse: string | null;
  placeholderInsight?: string;
}

const AiAssistantCardContent: React.FC<AiAssistantCardContentProps> = ({
  aiPrompt,
  setAiPrompt,
  handleAiSubmit,
  isAiLoading,
  aiResponse,
  placeholderInsight
}) => {
  return (
    <>
      <div className="flex flex-col items-start justify-start text-left p-4 pt-2 flex-grow">
        {placeholderInsight && (
          <p className="text-sm text-foreground/90 mb-4 mt-2">
            {placeholderInsight}
          </p>
        )}
        {aiResponse && <ScrollArea className="h-[80px] w-full"><p className="text-sm text-foreground bg-primary/10 dark:bg-primary/20 rounded-md p-3 mb-4 text-left whitespace-pre-wrap">{aiResponse}</p></ScrollArea>}
      </div>
      <form onSubmit={handleAiSubmit} className="p-4 border-t border-border/20 dark:border-white/10 mt-auto">
        <Textarea
          placeholder="Ask the AI assistant..."
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          rows={2}
          className="bg-input border-border/50 dark:border-white/20 focus:ring-primary mb-2 text-foreground placeholder-muted-foreground text-sm"
        />
        <button
          type="submit"
          className="w-full btn-gradient-primary-accent h-10 px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center"
          disabled={isAiLoading}
        >
          {isAiLoading ? <LoaderCircle className="animate-spin mr-2 h-4 w-4"/> : null}
          Send Prompt
        </button>
      </form>
    </>
  );
};

export default AiAssistantCardContent;
    