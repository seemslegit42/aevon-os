
"use client";
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AIBrainIcon, ZapIcon, AlertTriangleIcon, AIProcessingIcon } from '@/components/icons';
import { generateInsights } from '@/actions/generateInsights';
import { useLayoutStore } from '@/stores/layout.store';
import { useToast } from '@/hooks/use-toast';
import { shallow } from 'zustand/shallow';
import eventBus from '@/lib/event-bus';
import type { Insight } from '@/lib/ai-schemas';

export default function AiInsightsCardContent() {
    const [insights, setInsights] = useState<Insight[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();
    const layoutItems = useLayoutStore(state => state.layoutItems, shallow);
    
    const handleGenerateInsights = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setInsights(null);
        try {
            const result = await generateInsights(layoutItems);
            setInsights(result.insights);
        } catch (err: any) {
            const errorMessage = err.message || "An unexpected error occurred.";
            setError(errorMessage);
            toast({ variant: 'destructive', title: 'Failed to Generate Insights', description: errorMessage });
        } finally {
            setIsLoading(false);
        }
    }, [layoutItems, toast]);

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
            eventBus.emit('beep:submitQuery', command);
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
                    <AIProcessingIcon className="mx-auto h-8 w-8 text-primary animate-spin" />
                    <p className="mt-2 text-xs text-muted-foreground">Generating...</p>
                </div>
            );
        }

        if (error) {
            return (
                <Alert variant="destructive" className="max-w-lg mx-auto text-xs">
                    <AlertTriangleIcon className="h-4 w-4" />
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
                                <ZapIcon className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
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
                <AIBrainIcon className="mx-auto h-8 w-8 opacity-50" />
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
                <ZapIcon />
                {isLoading ? "Analyzing..." : "Generate Insights"}
            </Button>
        </div>
    );
}
