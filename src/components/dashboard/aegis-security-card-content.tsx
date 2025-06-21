
"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ShieldCheckIcon, AlertTriangleIcon, BrainCircuitIcon } from '@/components/icons';
import { useToast } from "@/hooks/use-toast";
import { type AegisSecurityAnalysis } from '@/lib/ai-schemas';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { Skeleton } from '../ui/skeleton';
import eventBus from '@/lib/event-bus';

const AegisSecurityCardContent: React.FC = () => {
  const [alertDetails, setAlertDetails] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AegisSecurityAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAnalyze = useCallback(async (detailsToAnalyze: string) => {
    if (!detailsToAnalyze.trim()) {
      toast({ 
        variant: "destructive", 
        title: "Input Required", 
        description: "Please paste alert details before analyzing." 
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await fetch('/api/ai/analyze-security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertDetails: detailsToAnalyze }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get a response from the AI.');
      }
      
      const result: AegisSecurityAnalysis = await response.json();
      setAnalysis(result);
      eventBus.emit('orchestration:log', { 
        task: 'Aegis Scan Completed', 
        status: 'success', 
        details: `Severity: ${result.severity}. ${result.summary}`
      });

    } catch (err: any) {
      setError(err.message);
      toast({ 
        variant: "destructive", 
        title: "Analysis Failed", 
        description: err.message || "An unknown error occurred."
      });
       eventBus.emit('orchestration:log', { 
        task: 'Aegis Scan Failed', 
        status: 'failure', 
        details: err.message || "An unknown error occurred."
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  useEffect(() => {
    const handleNewAlert = (data: string) => {
      setAlertDetails(data);
      handleAnalyze(data);
      eventBus.emit('panel:focus', 'aegisSecurity');
    };
    eventBus.on('aegis:new-alert', handleNewAlert);
    return () => {
      eventBus.off('aegis:new-alert', handleNewAlert);
    };
  }, [handleAnalyze]);
  
  const getSeverityBadgeClass = (severity?: AegisSecurityAnalysis['severity']) => {
    switch (severity) {
      case 'Critical': return 'badge-critical';
      case 'High': return 'badge-high';
      case 'Medium': return 'badge-medium';
      case 'Low': return 'badge-low';
      default: return '';
    }
  }

  const AnalysisResult: React.FC = () => {
    if (!analysis) return null;
    return (
      <div className="space-y-4 text-sm">
        <div>
          <h4 className="font-semibold text-primary mb-2">Severity Assessment</h4>
          <Badge className={cn("text-base", getSeverityBadgeClass(analysis.severity))}>
            {analysis.severity}
          </Badge>
          <p className="text-muted-foreground mt-2">{analysis.summary}</p>
        </div>
        <div>
          <h4 className="font-semibold text-primary mb-2">Identified Threats</h4>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            {analysis.identifiedThreats.map((threat, i) => <li key={i}>{threat}</li>)}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-primary mb-2">Suggested Actions</h4>
           <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            {analysis.suggestedActions.map((action, i) => <li key={i}>{action}</li>)}
          </ul>
        </div>
      </div>
    )
  };
  
  const LoadingSkeleton: React.FC = () => (
    <div className="space-y-4">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="pt-4">
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
        </div>
         <div className="pt-4">
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
        </div>
    </div>
  )


  return (
    <div className="space-y-3 h-full flex flex-col p-1">
      <Textarea
        placeholder="Paste security alert details here, or run the Loom Studio simulation to generate an event automatically."
        value={alertDetails}
        onChange={(e) => setAlertDetails(e.target.value)}
        rows={5}
        aria-label="Security alert details input"
        className="bg-input border-input placeholder:text-muted-foreground text-sm flex-shrink-0"
        disabled={isLoading}
      />
      <Button onClick={() => handleAnalyze(alertDetails)} disabled={isLoading || !alertDetails} className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0">
        {isLoading ? 'Analyzing...' : 'Analyze Alerts'}
        <ShieldCheckIcon className="w-4 h-4 ml-2" />
      </Button>

      <div className="flex-grow min-h-0">
        <ScrollArea className="h-full pr-2">
            {isLoading && <LoadingSkeleton />}
            {error && !isLoading && (
              <div className="flex flex-col items-center justify-center h-full text-destructive text-center">
                <AlertTriangleIcon className="w-10 h-10 mb-2" />
                <p className="font-semibold">Analysis Failed</p>
                <p className="text-xs">{error}</p>
              </div>
            )}
            {analysis && !isLoading && <AnalysisResult />}
            {!analysis && !isLoading && !error && (
              <div className="flex-grow flex h-full items-center justify-center text-muted-foreground text-center">
                  <div className="flex flex-col items-center">
                    <BrainCircuitIcon className="w-10 h-10 mb-2 opacity-50"/>
                    <p className="text-sm">Awaiting analysis...</p>
                    <p className="text-xs max-w-xs">Paste security data above or run the Loom Studio simulation to generate an event.</p>
                  </div>
              </div>
            )}
        </ScrollArea>
       </div>
    </div>
  );
};

export default AegisSecurityCardContent;
