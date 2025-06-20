
import React, { FormEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LoaderCircle } from 'lucide-react';
import type { Emitter } from 'mitt';
import { useAiAssistantStore } from '@/stores/ai-assistant.store';
import eventBus from '@/lib/event-bus'; // Assuming eventBus is the default export

interface AiAssistantCardContentProps {
  placeholderInsight?: string;
  eventBusInstance?: Emitter<any>;
}

const AiAssistantCardContent: React.FC<AiAssistantCardContentProps> = ({
  placeholderInsight,
  eventBusInstance
}) => {
  const {
    aiPrompt,
    setAiPrompt,
    aiResponse,
    isAiLoading,
    submitPrompt
  } = useAiAssistantStore();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    let systemData = "System metrics: Active Agents (from AgentPresence), Disk Usage, etc. (from SystemSnapshot)";
    submitPrompt(systemData);
  };

  useEffect(() => {
    const handleRequestSystemData = (callback: (data: string) => void) => {
      const data = "Operational Metrics: Active Agents (5), Disk Usage (450GB/1000GB)";
      callback(data);
    };

    eventBusInstance?.on('aiAssistant:requestSystemData', handleRequestSystemData as any);
    return () => {
      eventBusInstance?.off('aiAssistant:requestSystemData', handleRequestSystemData as any);
    };
  }, [eventBusInstance]);


  return (
    <>
      <div className="flex flex-col items-start justify-start text-left p-4 pt-2 flex-grow">
        {placeholderInsight && !aiResponse && !isAiLoading && (
          <p className="text-sm text-foreground/90 dark:text-neutral-300 mb-4 mt-2">
            {placeholderInsight}
          </p>
        )}
        {aiResponse && <ScrollArea className="h-[80px] w-full"><div className="text-sm text-foreground dark:text-white bg-primary/10 dark:bg-primary/20 rounded-md p-3 mb-4 text-left whitespace-pre-wrap">{aiResponse}</div></ScrollArea>}
        {isAiLoading && !aiResponse && (
            <div className="flex items-center justify-center w-full h-[80px]">
                <LoaderCircle className="animate-spin h-6 w-6 text-primary" />
            </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-border/10 dark:border-white/5 mt-auto">
        <Textarea
          placeholder="Ask the AI assistant..."
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          rows={2}
          className="bg-input border-border/50 dark:border-white/20 focus:ring-accent mb-2 text-foreground dark:text-white placeholder-muted-foreground dark:placeholder-neutral-400 text-sm"
          disabled={isAiLoading}
        />
        <button
          type="submit"
          className="w-full btn-wabi-sabi h-10 px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center"
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

