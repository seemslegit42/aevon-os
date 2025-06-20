
"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangleIcon, CheckCircleIcon, ShieldCheckIcon, InfoIcon } from '@/components/icons';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AnalyzeSecurityAlertsOutput {
  summary: string;
  potentialThreats?: string[];
  recommendedActions?: string[];
}

const AegisSecurityCardContent: React.FC = () => {
  const [alertDetails, setAlertDetails] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalyzeSecurityAlertsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!alertDetails.trim()) {
      toast({ variant: "destructive", title: "Input Error", description: "Please provide alert details to analyze." });
      return;
    }
    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const response = await fetch('/api/ai/security-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertDetails }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to parse error response" }));
        throw new Error(errorData.error || `API request failed with status ${response.status}`);
      }

      const result: AnalyzeSecurityAlertsOutput = await response.json();
      setAnalysisResult(result);

    } catch (error) {
      console.error("Error analyzing security alerts:", error);
      let errorMessage = "Failed to analyze security alerts.";
      if (error instanceof Error) {
          errorMessage = error.message;
      }
      setAnalysisResult(null);
      toast({ variant: "destructive", title: "Analysis Error", description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 h-full flex flex-col p-2">
      <Textarea
        placeholder="Paste security alert details here... e.g., logs, error messages, SIEM output."
        value={alertDetails}
        onChange={(e) => setAlertDetails(e.target.value)}
        rows={5}
        aria-label="Security alert details input"
        className="bg-input border-input placeholder:text-muted-foreground text-sm flex-shrink-0"
      />
      <Button onClick={handleAnalyze} disabled={isLoading} className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0">
        {isLoading ? 'Analyzing...' : 'Analyze Alerts'}
        <ShieldCheckIcon className="w-4 h-4 ml-2" />
      </Button>

      <div className="flex-grow min-h-0">
        {analysisResult ? (
          <ScrollArea className="h-full pr-3">
            <div className="space-y-3 text-sm">
                <Alert variant="destructive">
                  <AlertTriangleIcon className="h-4 w-4" />
                  <AlertTitle>Potential Threats</AlertTitle>
                  <AlertDescription>
                     <ul className="list-disc list-inside space-y-1">
                       {analysisResult.potentialThreats && analysisResult.potentialThreats.length > 0 
                         ? analysisResult.potentialThreats.map((threat, index) => <li key={`threat-${index}`}>{threat}</li>)
                         : <li>No specific threats identified.</li>
                       }
                      </ul>
                  </AlertDescription>
                </Alert>
                <Alert>
                   <InfoIcon className="h-4 w-4" />
                   <AlertTitle>Summary</AlertTitle>
                   <AlertDescription>
                     {analysisResult.summary || "No summary provided."}
                   </AlertDescription>
                </Alert>
                 <Alert>
                  <CheckCircleIcon className="h-4 w-4" />
                  <AlertTitle>Recommended Actions</AlertTitle>
                  <AlertDescription>
                      <ul className="list-disc list-inside space-y-1">
                        {analysisResult.recommendedActions && analysisResult.recommendedActions.length > 0 
                          ? analysisResult.recommendedActions.map((action, index) => <li key={`action-${index}`}>{action}</li>)
                          : <li>No specific actions recommended.</li>
                        }
                      </ul>
                  </AlertDescription>
                </Alert>
            </div>
          </ScrollArea>
        ) : (
          <div className="flex-grow flex h-full items-center justify-center text-muted-foreground text-center">
              <p className="text-sm">{isLoading ? "Aegis is analyzing..." : "Analysis results will appear here."}</p>
          </div>
        )}
       </div>
    </div>
  );
};

export default AegisSecurityCardContent;
