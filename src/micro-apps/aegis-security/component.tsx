
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useBeepChatStore } from '@/stores/beep-chat.store';
import eventBus from '@/lib/event-bus';
import { type AegisSecurityAnalysis } from '@/lib/ai-schemas';
import { Loader2, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

// Import the new service and child components
import { getAegisData, type AegisData } from '@/services/security.service';
import CyberHealthGauge from './cyber-health-gauge';
import CloudSecurityPanel from './CloudSecurityPanel';
import EdrSummaryPanel from './EdrSummaryPanel';
import PhishingResiliencePanel from './PhishingResiliencePanel';
import AegisAnalysisResult from './aegis-analysis-result';

const AegisSecurityComponent: React.FC = () => {
  const { toast } = useToast();
  const { append: beepAppend } = useBeepChatStore();

  const [aegisData, setAegisData] = useState<AegisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AegisSecurityAnalysis | null>(null);

  const fetchData = useCallback(async () => {
    // Only show the main loader on initial fetch
    if (!aegisData) setIsLoading(true);
    try {
      const data = await getAegisData();
      setAegisData(data);
    } catch (error) {
      console.error("Failed to fetch Aegis data:", error);
      toast({ variant: 'destructive', title: 'Data Error', description: 'Could not load Aegis security data.' });
    } finally {
      // Only turn off the main loader once. Subsequent re-fetches are silent.
      if (isLoading) setIsLoading(false);
    }
  }, [toast, aegisData, isLoading]);


  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, [fetchData]);

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
  
  if (isLoading || !aegisData) {
      return (
          <div className="h-full w-full p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 h-full">
                <Skeleton className="w-full h-full rounded-lg min-h-[200px]" />
                <Skeleton className="w-full h-full rounded-lg min-h-[200px]" />
                <Skeleton className="w-full h-full rounded-lg md:col-span-2 lg:col-span-1 min-h-[200px]" />
                <Skeleton className="w-full h-full rounded-lg md:col-span-2 lg:col-span-1 min-h-[200px]" />
            </div>
          </div>
      )
  }

  return (
    <div className="h-full w-full p-4 flex flex-col">
        <div className="flex-shrink-0 mb-4">
            <CyberHealthGauge score={aegisData.cyberHealthScore} />
        </div>
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0">
             <div className="flex flex-col gap-4">
                <CloudSecurityPanel data={aegisData.cloudSecurity} />
                <PhishingResiliencePanel data={aegisData.phishingResilience} />
            </div>
            <div className="flex flex-col gap-4">
                <EdrSummaryPanel data={aegisData.edrSummary} />
                 <div className="flex-grow w-full min-h-0 glassmorphism-panel rounded-lg">
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
        </div>
    </div>
  );
};

export default AegisSecurityComponent;
