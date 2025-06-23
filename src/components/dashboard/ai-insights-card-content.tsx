"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Lightbulb, Zap, ArrowClockwise } from 'phosphor-react';
import eventBus from '@/lib/event-bus';
import { useBeepChat } from '@/hooks/use-beep-chat';
import type { AiInsights, Insight } from '@/lib/ai-schemas';
import { useLayoutStore } from '@/stores/layout.store';

const AiInsightsCardContent: React.FC = () => {
    const { toast } = useToast();
    const [insights, setInsights] = useState<AiInsights | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { append, isLoading: isBeepLoading } = useBeepChat();
    const layoutItems = useLayoutStore(state => state.layoutItems);

    const handleInsightsResult = useCallback((result: AiInsights) => {
        setInsights(result);
        setIsLoading(false);
        setError(null);
    }, []);

    const handleInsightsError = useCallback((errorMessage: string) => {
        setError(errorMessage);
        setIsLoading(false);
        setInsights(null);
        toast({ variant: "destructive", title: "Insights Failed", description: errorMessage });
    }, [toast]);
    
    useEffect(() => {
        // Listen for results pushed from the agent's tool call
        eventBus.on('insights:result', handleInsightsResult);
        eventBus.on('insights:error', handleInsightsError);

        return () => {
            eventBus.off('insights:result', handleInsightsResult);
            eventBus.off('insights:error', handleInsightsError);
        }
    }, [handleInsightsResult, handleInsightsError]);

    const handleGenerateInsights = () => {
        setIsLoading(true);
        setError(null);
        setInsights(null);
        append({
            role: 'user',
            content: 'Generate insights for my current workspace layout.'
        }, {
            options: { body: { layoutItems } }
        });
    };
    
    // Effect to handle loading state from beep
    useEffect(() => {
      if (!isBeepLoading && isLoading) {
         // If beep is done but we're still loading, it means the tool call
         // might have failed silently or didn't emit. Reset after a timeout.
         setTimeout(() => {
            if (isLoading) {
               setIsLoading(false);
               if (!insights) {
                   setError("Did not receive insights. The agent may be busy or an error occurred.");
               }
            }
         }, 3000);
      }
    }, [isBeepLoading, isLoading, insights]);

    const handleActionClick = (insight: Insight) => {
        if (!insight.action) return;
        const { tool, itemId, displayText } = insight.action;
        let command = '';
        if (tool === 'addItem') {
            command = `Add the ${displayText} to my workspace.`;
        } else if (tool === 'focusItem') {
            command = `Focus the window with instance ID ${itemId}.`;
        }
        
        if (command) {
            toast({ title: "Action Sent", description: `Asking BEEP to: "${command}"`});
            append({ role: 'user', content: command });
        }
    };
    
    const InsightsSkeleton = () => (
        <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                    <Skeleton className="h-5 w-5 rounded-full mt-1" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-8 w-1/3" />
                    </div>
                </div>
            ))}
        </div>
    );
    
    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-3">
                <p className="text-xs text-muted-foreground">Personalized workspace recommendations</p>
                <Button variant="ghost" size="sm" onClick={handleGenerateInsights} disabled={isBeepLoading}>
                    <ArrowClockwise className={`w-3 h-3 mr-1.5 ${isBeepLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>
            <div className="flex-grow">
                {isLoading && <InsightsSkeleton />}
                {!isLoading && error && (
                    <div className="text-center text-destructive p-4">
                        <p className="font-semibold">Error</p>
                        <p className="text-xs">{error}</p>
                    </div>
                )}
                {!isLoading && !error && insights && (
                    <ul className="space-y-4">
                        {insights.insights.map((insight, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <Lightbulb className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                                <div className="flex-1">
                                    <p className="text-sm">{insight.text}</p>
                                    {insight.action && (
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            className="mt-2 btn-wabi-sabi"
                                            onClick={() => handleActionClick(insight)}
                                        >
                                            <Zap className="w-3 h-3 mr-1.5" />
                                            {insight.action.displayText}
                                        </Button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
                {!isLoading && !error && !insights && (
                     <div className="text-center text-muted-foreground pt-4">
                        <p>Click 'Refresh' to generate AI insights.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AiInsightsCardContent;
