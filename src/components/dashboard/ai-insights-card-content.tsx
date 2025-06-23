
"use client";
import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Brain, Zap, Warning, GearSix } from 'phosphor-react';
import { useToast } from '@/hooks/use-toast';
import eventBus from '@/lib/event-bus';
import type { Insight, AiInsights } from '@/lib/ai-schemas';
import { useBeepChat } from '@/hooks/use-beep-chat';

export default function AiInsightsCardContent() {
    const [insights, setInsights] = useState<Insight[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();
    const { append: beepAppend, isLoading: isBeepLoading } = useBeepChat();
    
    const handleGenerateInsights = useCallback(() => {
        setError(null);
        setInsights(null);
        beepAppend({ role: 'user', content: 'Generate some insights for my current workspace layout.' });
    }, [beepAppend]);

    useEffect(() => {
        setIsLoading(isBeepLoading);
    }, [isBeepLoading]);

    useEffect(() => {
        const handleInsightsResult = (result: AiInsights) => {
            setInsights(result.insights);
            setIsLoading(false);
        };

        const handleInsightsError = (errorMessage: string) => {
            setError(errorMessage);
            setIsLoading(false);
            toast({ variant: 'destructive', title: 'Failed to Generate Insights', description: errorMessage });
        };
        
        eventBus.on('insights:result', handleInsightsResult);
        eventBus.on('insights:error', handleInsightsError);

        return () => {
            eventBus.off('insights:result', handleInsightsResult);
            eventBus.off('insights:error', handleInsightsError);
        }
    }, [toast]);


    const handleExecuteAction = (insight: Insight) => {
        if (!insight.action) return;

        const { tool, itemId } = insight.action;
        let command = "";
        if (tool === 'addItem') {
            command = `Add the item with ID ${itemId}`;
        } else if (tool === 'focusItem') {
            command = `Focus on the window with instance ID ${itemId}`;
        }

        if (command) {
            beepAppend({ role: 'user', content: command });
            toast({
                title: 'Action Sent to BEEP',
                description: `Executing: "${insight.text}"`,
            });
        }
    };
    
    const InsightsDisplay = () => {
        if (isLoading) {
            return (
                <div className="text-center py-4">
                    <GearSix className="mx-auto h-8 w-8 text-primary animate-spin" />
                    <p className="mt-2 text-xs text-muted-foreground">Generating...</p>
                </div>
            );
        }

        if (error) {
            return (
                <Alert variant="destructive" className="max-w-lg mx-auto text-xs">
                    <Warning className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            );
        }

        if (insights && insights.length > 0) {
            return (
                <div className="space-y-3">
                    {insights.map((insight, index) => (
                        <div key={index} className="glassmorphism-panel p-3 flex flex-col justify-between text-xs">
                            <div className="flex items-start gap-2">
                                <Zap className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                                <p className="text-foreground flex-1">{insight.text}</p>
                            </div>
                            {insight.action && (
                                <Button size="sm" onClick={() => handleExecuteAction(insight)} className="mt-2 w-full h-7 text-xs btn-wabi-sabi">
                                    {insight.action.displayText}
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            );
        }

        return (
             <div className="text-center text-muted-foreground py-4">
                <Brain className="mx-auto h-8 w-8 opacity-50" />
                <p className="mt-2 text-xs">Click generate to get AI insights.</p>
            </div>
        );
    };


    return (
        <div className="flex flex-col h-full p-1">
           <div className="flex-grow overflow-y-auto pr-2">
             <InsightsDisplay />
           </div>
            <Button size="sm" onClick={handleGenerateInsights} disabled={isLoading} className="btn-gradient-primary-accent mt-2 flex-shrink-0">
                <Zap />
                {isLoading ? "Analyzing..." : "Generate Insights"}
            </Button>
        </div>
    );
}
