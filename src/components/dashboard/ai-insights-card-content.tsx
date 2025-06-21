
"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { BrainCircuitIcon, RefreshCwIcon, AlertTriangleIcon } from '@/components/icons';
import { useLayoutStore } from '@/stores/layout.store';
import { type AiInsights } from '@/lib/ai-schemas';
import { Skeleton } from '../ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { shallow } from 'zustand/shallow';
import { generateInsights } from '@/actions/generateInsights';

const AiInsightsCardContent: React.FC = () => {
    const [insights, setInsights] = useState<string[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    // Selectively subscribe to layoutItems.
    const layoutItems = useLayoutStore(state => state.layoutItems, shallow);

    const fetchInsights = useCallback(async () => {
        // Prevent multiple requests from firing at the same time.
        if (isLoading) return;

        setIsLoading(true);
        setError(null);
        
        try {
            const result: AiInsights = await generateInsights(layoutItems);
            setInsights(result.insights);

        } catch (err: any) {
            setError(err.message);
            toast({ 
                variant: "destructive", 
                title: "Insight Generation Failed", 
                description: err.message
            });
        } finally {
            setIsLoading(false);
        }
    }, [layoutItems, toast, isLoading]);

    // Fetch insights on initial mount only.
    // Subsequent fetches are triggered manually by the user to prevent rate-limiting.
    useEffect(() => {
        fetchInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    const LoadingSkeleton = () => (
        <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
        </div>
    );

    const ErrorDisplay = () => (
        <div className="text-center text-destructive">
            <AlertTriangleIcon className="mx-auto h-8 w-8 mb-2" />
            <p className="font-semibold">Could not fetch insights</p>
            <p className="text-xs">{error}</p>
        </div>
    );
    
    const InsightList = () => (
        <ul className="space-y-3 text-left">
            {insights?.map((insight, index) => (
                <li key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
                   <BrainCircuitIcon className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                   <span>{insight}</span>
                </li>
            ))}
        </ul>
    );

    return (
        <div className="flex flex-col h-full text-center p-2">
            <div className="flex-grow flex items-center justify-center">
                 {isLoading && <LoadingSkeleton />}
                 {!isLoading && error && <ErrorDisplay />}
                 {!isLoading && !error && insights && insights.length > 0 && <InsightList />}
                 {!isLoading && !error && (!insights || insights.length === 0) && (
                     <p className="text-sm text-muted-foreground">No insights available at the moment.</p>
                 )}
            </div>
            <div className="flex-shrink-0 pt-2">
                <Button variant="ghost" size="sm" onClick={fetchInsights} disabled={isLoading}>
                    <RefreshCwIcon className={isLoading ? 'animate-spin' : ''}/>
                    Refresh
                </Button>
            </div>
        </div>
    );
};

export default AiInsightsCardContent;
