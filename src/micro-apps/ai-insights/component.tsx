
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Lightbulb, Sparkles, ArrowRight, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useBeepChat } from '@/hooks/use-beep-chat';
import { type AiInsights, type Insight } from '@/lib/ai-schemas';
import { motion, AnimatePresence } from 'framer-motion';
import eventBus from '@/lib/event-bus';

const AiInsightsCardContent: React.FC = () => {
  const { toast } = useToast();
  const [insights, setInsights] = useState<AiInsights | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isWaitingForInsights, setIsWaitingForInsights] = useState(false);
  
  const { append: beepAppend, messages: beepMessages, isLoading: isBeepLoading } = useBeepChat();

  const handleGenerateInsights = useCallback(() => {
    setError(null);
    setInsights(null);
    setIsWaitingForInsights(true);
    beepAppend({ role: 'user', content: "Generate new workspace insights based on my current layout." });
  }, [beepAppend]);
  
  useEffect(() => {
    if (isBeepLoading || !isWaitingForInsights) return;
    
    const lastMessage = beepMessages[beepMessages.length - 1];
    if (lastMessage?.role === 'tool' && lastMessage.name === 'generateWorkspaceInsights') {
        try {
            const result = JSON.parse(lastMessage.content) as AiInsights;
            if (result.insights) {
                setInsights(result);
                const insightsText = result.insights.map(i => i.text).join(' ');
                eventBus.emit('beep:response', `I have found some new insights for you. ${insightsText}`);
            } else {
                 setError('The AI returned an unexpected format for insights.');
            }
        } catch (e) {
            setError('Failed to parse insights from the AI response.');
        } finally {
            setIsWaitingForInsights(false);
        }
    }
  }, [isBeepLoading, isWaitingForInsights, beepMessages]);
  
  const handleInsightAction = (insight: Insight) => {
    if (!insight.action) return;
    const { tool, itemId } = insight.action;
    const prompt = `Execute the UI action: ${tool} with itemId: ${itemId}`;
    beepAppend({ role: 'user', content: prompt });
    toast({ title: "Action Sent", description: `Sent command to BEEP: "${prompt}"` });
  };
  
  const isLoading = isBeepLoading && isWaitingForInsights;

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
                    transition={{ duration: 0.3 }}
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
    <div className="p-4 space-y-4">
      <div className="min-h-[100px]">
        <InsightsDisplay />
      </div>
      <div className="pt-4">
        <Button onClick={handleGenerateInsights} className="w-full btn-gradient-primary-secondary" disabled={isLoading}>
          <Sparkles />
          {isLoading ? 'Generating...' : 'Generate Insights'}
        </Button>
      </div>
    </div>
  );
};

export default AiInsightsCardContent;
