
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CyberHealthGauge from './cyber-health-gauge';
import AegisAnalysisResult from './aegis-analysis-result';
import { useAegisStore } from './store';
import { useBeepChatStore } from '@/stores/beep-chat.store';
import eventBus from '@/lib/event-bus';
import { type AegisSecurityAnalysis } from '@/lib/ai-schemas';
import { Loader2, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

const AegisSecurityComponent: React.FC = () => {
  const { toast } = useToast();
  const simulateUpdate = useAegisStore((state) => state.actions.simulateUpdate);
  const { append: beepAppend } = useBeepChatStore();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AegisSecurityAnalysis | null>(null);

  useEffect(() => {
    simulateUpdate();
    const intervalId = setInterval(() => simulateUpdate(), 5000);
    return () => clearInterval(intervalId);
  }, [simulateUpdate]);

  const handleNewAlert = useCallback((alertDetails: string) => {
    toast({
        title: '🛡️ Aegis Alert',
        description: 'A new security event has been detected. BEEP is analyzing...',
        variant: 'destructive',
    });
    setIsAnalyzing(true);
    setAnalysisResult(null); // Clear previous result
    beepAppend({ role: 'user', content: `Analyze this security alert and provide your findings: ${alertDetails}` });
  }, [beepAppend, toast]);

  const handleAnalysisResult = useCallback((result: AegisSecurityAnalysis) => {
    setAnalysisResult(result);
    setIsAnalyzing(false);
  }, []);

  useEffect(() => {
    eventBus.on('aegis:new-alert', handleNewAlert);
    eventBus.on('aegis:analysis-result', handleAnalysisResult);

    return () => {
      eventBus.off('aegis:new-alert', handleNewAlert);
      eventBus.off('aegis:analysis-result', handleAnalysisResult);
    };
  }, [handleNewAlert, handleAnalysisResult]);

  return (
    <div className="h-full w-full flex flex-col items-center p-4 bg-transparent gap-4">
      <div className="flex-shrink-0 w-full max-w-sm">
        <CyberHealthGauge />
      </div>
      
      <div className="flex-grow w-full max-w-sm min-h-0 glassmorphism-panel rounded-lg">
        <AnimatePresence mode="wait">
          {isAnalyzing ? (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center h-full text-center text-muted-foreground"
            >
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
              <p className="font-semibold">Analyzing Threat...</p>
            </motion.div>
          ) : analysisResult ? (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <ScrollArea className="h-full">
                <AegisAnalysisResult result={analysisResult} />
              </ScrollArea>
            </motion.div>
          ) : (
             <motion.div
                key="idle"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center justify-center h-full text-center text-muted-foreground"
              >
                <ShieldCheck className="w-8 h-8 text-chart-4 mb-2" />
                <p className="font-semibold">System Secure</p>
                <p className="text-xs">Awaiting security events...</p>
              </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AegisSecurityComponent;
