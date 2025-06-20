
import React, { FormEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RefreshCwIcon as LoaderCircleIcon } from '@/components/icons'; 
import type { Emitter } from 'mitt';
import { useBeepStore } from '@/stores/beep.store';
import eventBus from '@/lib/event-bus';

interface BeepCardContentProps {
  placeholderInsight?: string;
  eventBusInstance?: Emitter<any>;
}

const BeepCardContent: React.FC<BeepCardContentProps> = ({
  placeholderInsight,
  eventBusInstance
}) => {
  const {
    aiPrompt,
    setAiPrompt,
    aiResponse,
    isAiLoading,
    submitPrompt
  } = useBeepStore();

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

    eventBusInstance?.on('beep:requestSystemData', handleRequestSystemData as any);
    return () => {
      eventBusInstance?.off('beep:requestSystemData', handleRequestSystemData as any);
    };
  }, [eventBusInstance]);


  return (
    <>
      <div className="flex flex-col items-start justify-start text-left p-4 pt-2 flex-grow">
        {placeholderInsight && !aiResponse && !isAiLoading && (
          <p className="text-sm text-muted-foreground mb-4 mt-2">
            {placeholderInsight}
          </p>
        )}
        {aiResponse && <ScrollArea className="h-[80px] w-full"><div className="text-sm text-foreground dark:text-white bg-primary/10 dark:bg-primary/20 rounded-md p-3 mb-4 text-left whitespace-pre-wrap">{aiResponse}</div></ScrollArea>}
        {isAiLoading && !aiResponse && (
            <div className="flex items-center justify-center w-full h-[80px]">
                <LoaderCircleIcon className="animate-spin h-6 w-6 text-primary" /> 
            </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-border/10 dark:border-white/5 mt-auto">
        <Textarea
          placeholder="Ask BEEP..."
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          rows={2}
          className="bg-input border-input mb-2 text-foreground dark:text-white placeholder:text-muted-foreground text-sm"
          disabled={isAiLoading}
        />
        <button
          type="submit"
          className="w-full btn-gradient-primary-secondary h-10 px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center"
          disabled={isAiLoading}
        >
          {isAiLoading ? <LoaderCircleIcon className="animate-spin mr-2 h-4 w-4"/> : null} 
          Send Prompt
        </button>
      </form>
    </>
  );
};

export default BeepCardContent;
