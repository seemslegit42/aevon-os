
"use client";
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BrainCircuitIcon, ZapIcon, AlertTriangleIcon, SparklesIcon, LoaderIcon } from '@/components/icons';
import { generateInsights } from '@/actions/generateInsights';
import { useLayoutStore } from '@/stores/layout.store';
import { useToast } from '@/hooks/use-toast';
import { shallow } from 'zustand/shallow';
import eventBus from '@/lib/event-bus';
import type { Insight } from '@/lib/ai-schemas';

export default function AiInsightsPage() {
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
                <div className="text-center">
                    <LoaderIcon className="mx-auto h-12 w-12 text-primary animate-spin" />
                    <p className="mt-4 text-muted-foreground">Generating personalized insights...</p>
                </div>
            );
        }

        if (error) {
            return (
                <Alert variant="destructive" className="max-w-lg mx-auto">
                    <AlertTriangleIcon className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            );
        }

        if (insights) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {insights.map((insight, index) => (
                        <div key={index} className="glassmorphism-panel p-6 flex flex-col justify-between">
                            <div className="flex items-start gap-4">
                                <SparklesIcon className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                                <p className="text-foreground">{insight.text}</p>
                            </div>
                            {insight.action && (
                                <Button onClick={() => handleExecuteAction(insight)} className="mt-4 w-full btn-wabi-sabi">
                                    {insight.action.displayText}
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            );
        }

        return null;
    };

    return (
        <div className="flex flex-col items-center h-full p-4 md:p-8 text-center">
            <BrainCircuitIcon className="w-16 h-16 mb-4 text-primary" />
            <h1 className="text-4xl font-bold mb-2 font-headline text-primary-foreground">
                AI Insights Engine
            </h1>
            <p className="text-lg mb-8 text-muted-foreground max-w-2xl">
                Let ΛΞVON analyze your current workspace and provide personalized recommendations to optimize your workflow.
            </p>
            
            <Button size="lg" onClick={handleGenerateInsights} disabled={isLoading} className="btn-gradient-primary-accent mb-12">
                <ZapIcon />
                {isLoading ? "Analyzing..." : "Generate Insights Report"}
            </Button>

            <div className="w-full max-w-6xl">
                <InsightsDisplay />
            </div>
        </div>
    );
}
