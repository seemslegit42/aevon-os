
"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangleIcon, CheckCircleIcon } from '@/components/icons';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'; // Card for internal structure
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
    <div className="space-y-4 h-full flex flex-col">
      <Textarea
        placeholder="Paste security alert details here... e.g., logs, error messages, SIEM output."
        value={alertDetails}
        onChange={(e) => setAlertDetails(e.target.value)}
        rows={6}
        aria-label="Security alert details input"
        className="bg-input border-input placeholder:text-muted-foreground text-sm"
      />
      <Button onClick={handleAnalyze} disabled={isLoading} className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
        {isLoading ? 'Analyzing...' : 'Analyze Alerts'}
        <AlertTriangleIcon className="w-4 h-4 ml-2" />
      </Button>

      {analysisResult && (
        <Card className="mt-4 glassmorphism-panel flex-grow">
          <CardHeader className="py-3">
            <CardTitle className="text-lg font-headline text-primary flex items-center">
              <CheckCircleIcon className="w-5 h-5 mr-2 text-secondary" /> AI Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2 pb-4">
            <ScrollArea className="h-[200px] pr-3 space-y-2 text-sm">
              <div>
                <h4 className="font-semibold text-foreground mb-1">Summary:</h4>
                <p className="text-foreground whitespace-pre-wrap">{analysisResult.summary}</p>
              </div>
              {analysisResult.potentialThreats && analysisResult.potentialThreats.length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Potential Threats:</h4>
                  <ul className="list-disc list-inside space-y-1 text-foreground">
                    {analysisResult.potentialThreats.map((threat, index) => (
                      <li key={`threat-${index}`}>{threat}</li>
                    ))}
                  </ul>
                </div>
              )}
              {analysisResult.recommendedActions && analysisResult.recommendedActions.length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Recommended Actions:</h4>
                  <ul className="list-disc list-inside space-y-1 text-foreground">
                    {analysisResult.recommendedActions.map((action, index) => (
                      <li key={`action-${index}`}>{action}</li>
                    ))}
                  </ul>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
       {!analysisResult && !isLoading && (
         <div className="flex-grow flex items-center justify-center text-muted-foreground">
            <p>Analysis results will appear here.</p>
         </div>
       )}
    </div>
  );
};

export default AegisSecurityCardContent;
