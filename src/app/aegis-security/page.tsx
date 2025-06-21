
"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import eventBus from '@/lib/event-bus';
import { type AegisSecurityAnalysis } from '@/lib/ai-schemas';
import CyberHealthGauge from '@/components/dashboard/aegis/cyber-health-gauge';
import AegisAnalysisResult from '@/components/dashboard/aegis/aegis-analysis-result';
import PhishingResiliencePanel from '@/components/dashboard/aegis/PhishingResiliencePanel';
import CloudSecurityPanel from '@/components/dashboard/aegis/CloudSecurityPanel';
import EdrSummaryPanel from '@/components/dashboard/aegis/EdrSummaryPanel';
import { Button } from '@/components/ui/button';
import { AlertTriangleIcon, ZapIcon } from '@/components/icons';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { analyzeSecurityAlert } from '@/actions/analyzeSecurity';

const MOCK_ALERT_DATA = JSON.stringify({
  alert: "Anomalous login detected",
  timestamp: new Date().toISOString(),
  source_ip: "198.51.100.24",
  user: "j.doe",
  details: "Multiple failed login attempts followed by a successful login from an unrecognized ASN in a different geographical region.",
}, null, 2);

const AegisSecurityPage: React.FC = () => {
  const { toast } = useToast();
  const [analysis, setAnalysis] = useState<AegisSecurityAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = useCallback(async (alertDetails: string) => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await analyzeSecurityAlert(alertDetails);
      setAnalysis(result);
      eventBus.emit('orchestration:log', { 
        task: 'Aegis: Analysis Complete', 
        status: 'success', 
        details: `Severity assessed as ${result.severity}.`,
        targetId: 'aegisSecurity' 
      });

    } catch (err: any) {
      setError(err.message);
      toast({ variant: "destructive", title: "Analysis Failed", description: err.message });
       eventBus.emit('orchestration:log', { 
         task: 'Aegis: Analysis Failed', 
         status: 'failure', 
         details: err.message,
         targetId: 'aegisSecurity'
        });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    eventBus.on('aegis:new-alert', handleAnalysis);
    return () => {
      eventBus.off('aegis:new-alert', handleAnalysis);
    };
  }, [handleAnalysis]);

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
      <AlertTriangleIcon className="mx-auto h-8 w-8 mb-2" />
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
                  <Button size="sm" variant="outline" onClick={() => handleAnalysis(MOCK_ALERT_DATA)}>
                    <ZapIcon className="w-4 h-4 mr-2" />
                    Trigger Mock Alert
                  </Button>
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
