
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
  eventBusInstance // Keep eventBusInstance prop for potential agent interactions
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
    // Potentially get system snapshot data from another store or via event bus
    // For now, passing undefined or a placeholder
    let systemData = "System metrics: Active Agents (from AgentPresence), Disk Usage, etc. (from SystemSnapshot)"; 
    // This data would ideally be dynamically fetched from other stores via the event bus or direct store access if architected that way.
    // For simplicity, the AI flow already includes example static data, so we can pass a generic trigger.
    submitPrompt(systemData);
  };
  
  useEffect(() => {
    const handleRequestSystemData = (callback: (data: string) => void) => {
      // In a real scenario, this would fetch data from system snapshot store
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
          <p className="text-sm text-foreground/90 mb-4 mt-2">
            {placeholderInsight}
          </p>
        )}
        {aiResponse && <ScrollArea className="h-[80px] w-full"><p className="text-sm text-foreground bg-primary/10 dark:bg-primary/20 rounded-md p-3 mb-4 text-left whitespace-pre-wrap">{aiResponse}</p></ScrollArea>}
        {isAiLoading && !aiResponse && (
            <div className="flex items-center justify-center w-full h-[80px]">
                <LoaderCircle className="animate-spin h-6 w-6 text-primary" />
            </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-border/20 dark:border-white/10 mt-auto">
        <Textarea
          placeholder="Ask the AI assistant..."
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          rows={2}
          className="bg-input border-border/50 dark:border-white/20 focus:ring-primary mb-2 text-foreground placeholder-muted-foreground text-sm"
          disabled={isAiLoading}
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
