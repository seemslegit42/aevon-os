"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import eventBus from '@/lib/event-bus';
import { type AegisSecurityAnalysis } from '@/lib/ai-schemas';
import CyberHealthGauge from '@/app/aegis-security/cyber-health-gauge';
import AegisAnalysisResult from '@/app/aegis-security/aegis-analysis-result';
import PhishingResiliencePanel from '@/app/aegis-security/PhishingResiliencePanel';
import CloudSecurityPanel from '@/app/aegis-security/CloudSecurityPanel';
import EdrSummaryPanel from '@/app/aegis-security/EdrSummaryPanel';
import { Warning, Zap } from 'phosphor-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';

const AegisSecurityPage: React.FC = () => {
  const { toast } = useToast();
  const [analysis, setAnalysis] = useState<AegisSecurityAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // This function is triggered by the global event bus when an alert comes in.
  const handleIncomingAlert = useCallback((alertDetails: string) => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    
    eventBus.emit('orchestration:log', { 
        task: 'Aegis: Analysis Started', 
        status: 'success', 
        details: 'Received new alert. Dispatching to BEEP for analysis.',
        targetId: 'aegisSecurity' 
    });

    // Dispatch the analysis task to the BEEP agent.
    eventBus.emit('beep:submitQuery', `Analyze the following security alert and return the structured result: \`\`\`json\n${alertDetails}\n\`\`\``);

  }, []);

  // Effect to listen for analysis results from the agent
  useEffect(() => {
    const handleAnalysisResult = (result: AegisSecurityAnalysis) => {
        setAnalysis(result);
        setIsLoading(false);
        eventBus.emit('orchestration:log', { 
            task: 'Aegis: Analysis Complete', 
            status: 'success', 
            details: `Severity assessed as ${result.severity}.`,
            targetId: 'aegisSecurity' 
        });
    };

    const handleAnalysisError = (errorMessage: string) => {
        setError(errorMessage);
        setIsLoading(false);
        toast({ variant: "destructive", title: "Analysis Failed", description: errorMessage });
        eventBus.emit('orchestration:log', { 
            task: 'Aegis: Analysis Failed', 
            status: 'failure', 
            details: errorMessage,
            targetId: 'aegisSecurity'
        });
    };

    eventBus.on('aegis:new-alert', handleIncomingAlert);
    eventBus.on('aegis:analysis-result', handleAnalysisResult);
    eventBus.on('aegis:analysis-error', handleAnalysisError);

    return () => {
      eventBus.off('aegis:new-alert', handleIncomingAlert);
      eventBus.off('aegis:analysis-result', handleAnalysisResult);
      eventBus.off('aegis:analysis-error', handleAnalysisError);
    };
  }, [toast, handleIncomingAlert]);

  const AnalysisLoader = () => (
    <div className="p-4 space-y-4">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <div className="space-y-2 pt-4">
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
      </div>
      <div className="space-y-2 pt-4">
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  );

  const ErrorDisplay = () => (
    <div className="p-4 text-center text-destructive">
      <Warning className="mx-auto h-8 w-8 mb-2" />
      <p className="font-semibold">Analysis Failed</p>
      <p className="text-xs">{error}</p>
    </div>
  );

  return (
    <div className="h-full p-4 md:p-8">
      <h1 className="text-3xl font-bold font-headline text-primary mb-2">Aegis Security Command</h1>
      <p className="text-muted-foreground mb-6">Real-time security posture and threat analysis for your entire digital ecosystem.</p>

      <ScrollArea className="h-[calc(100%-80px)]">
        <div className="p-1 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex justify-center items-center">
              <CyberHealthGauge />
            </div>
            <div className="border border-border/20 rounded-lg p-4 min-h-[250px] flex flex-col justify-center glassmorphism-panel">
              {isLoading && <AnalysisLoader />}
              {error && <ErrorDisplay />}
              {analysis && <AegisAnalysisResult result={analysis} />}
              {!isLoading && !error && !analysis && (
                <div className="text-center text-muted-foreground p-4">
                  <p className="text-sm mb-4">Awaiting security events...</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <PhishingResiliencePanel />
            <CloudSecurityPanel />
            <EdrSummaryPanel />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default AegisSecurityPage;
