
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Sparkles, ArrowRight, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useBeepChat } from '@/hooks/use-beep-chat';
import eventBus from '@/lib/event-bus';
import { type AiInsights, type Insight } from '@/lib/ai-schemas';
import { motion, AnimatePresence } from 'framer-motion';
import { useTTS } from '@/hooks/use-tts';

const AiInsightsCardContent: React.FC = () => {
  const { toast } = useToast();
  const [insights, setInsights] = useState<AiInsights | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { append: beepAppend, isLoading: isBeepLoading } = useBeepChat();
  const { playAudio } = useTTS({});

  const handleGenerateInsights = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setInsights(null);

    beepAppend({ role: 'user', content: "Generate new workspace insights based on my current layout." });
  }, [beepAppend]);
  
  useEffect(() => {
    setIsLoading(isBeepLoading);
  }, [isBeepLoading]);

  useEffect(() => {
    const handleInsightsResult = (result: AiInsights) => {
        setInsights(result);
        setIsLoading(false);
        const insightsText = result.insights.map(i => i.text).join(' ');
        playAudio(`I have found some new insights for you. ${insightsText}`);
    };
    
    const handleInsightsError = (errorMessage: string) => {
        setError(errorMessage);
        setIsLoading(false);
        toast({ variant: 'destructive', title: 'Insight Generation Failed', description: errorMessage });
    };

    eventBus.on('insights:result', handleInsightsResult);
    eventBus.on('insights:error', handleInsightsError);

    return () => {
      eventBus.off('insights:result', handleInsightsResult);
      eventBus.off('insights:error', handleInsightsError);
    };
  }, [toast, playAudio]);
  
  const handleInsightAction = (insight: Insight) => {
    if (!insight.action) return;
    const { tool, itemId } = insight.action;
    const prompt = `Execute the UI action: ${tool} with itemId: ${itemId}`;
    beepAppend({ role: 'user', content: prompt });
    toast({ title: "Action Sent", description: `Sent command to BEEP: "${prompt}"` });
  };
  
  const InsightsDisplay = () => {
    if (isLoading) {
      return (
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      );
    }

    if (error) {
       return (
            <div className="text-center text-destructive p-4">
                <AlertTriangle className="mx-auto h-8 w-8 mb-2" />
                <h4 className="font-semibold">Generation Failed</h4>
                <p className="text-xs">{error}</p>
            </div>
       )
    }

    if (insights && insights.insights.length > 0) {
      return (
        <div className="space-y-3">
            <AnimatePresence>
            {insights.insights.map((insight, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                    <Card className="p-3 bg-card/50">
                        <div className="flex items-start gap-3">
                            <Lightbulb className="h-4 w-4 text-accent mt-1 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-sm text-foreground">{insight.text}</p>
                                {insight.action && (
                                    <Button
                                        variant="link"
                                        className="p-0 h-auto text-xs text-secondary mt-1"
                                        onClick={() => handleInsightAction(insight)}
                                    >
                                        {insight.action.displayText} <ArrowRight className="ml-1 h-3 w-3" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Card>
                </motion.div>
            ))}
            </AnimatePresence>
        </div>
      );
    }
    
    return (
        <div className="text-center text-muted-foreground p-4">
            <p className="text-sm">Click "Generate Insights" to get personalized recommendations.</p>
        </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
        <div className="flex-grow">
            <InsightsDisplay />
        </div>
        <div className="flex-shrink-0 pt-2">
            <Button onClick={handleGenerateInsights} className="w-full btn-gradient-primary-secondary" disabled={isLoading}>
                <Sparkles />
                {isLoading ? 'Generating...' : 'Generate Insights'}
            </Button>
        </div>
    </div>
  );
};

export default AiInsightsCardContent;
