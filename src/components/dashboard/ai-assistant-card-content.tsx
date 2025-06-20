
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
}

const AiAssistantCardContent: React.FC<AiAssistantCardContentProps> = ({
  aiPrompt,
  setAiPrompt,
  handleAiSubmit,
  isAiLoading,
  aiResponse,
}) => {
  return (
    <>
      <div className="flex flex-col items-center justify-center text-center p-6 flex-grow">
        {/* Placeholder Image removed */}
        <p className="text-sm text-muted-foreground mb-4 mt-4"> {/* Added mt-4 for spacing */}
          Analyze product sales, compare revenue, or ask for insights.
        </p>
        {aiResponse && <ScrollArea className="h-[120px] w-full"><p className="text-sm text-foreground bg-primary/10 dark:bg-primary/20 rounded-md p-3 mb-4 text-left whitespace-pre-wrap">{aiResponse}</p></ScrollArea>}
      </div>
      <form onSubmit={handleAiSubmit} className="p-4 border-t border-border/30 dark:border-border/50 mt-auto">
        <Textarea
          placeholder="Ask the AI assistant..."
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          rows={2}
          className="bg-background/70 dark:bg-input border-border/50 focus:ring-primary mb-2"
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
