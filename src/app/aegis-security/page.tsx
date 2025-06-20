
"use client";
import React, { useState } from 'react';
import MicroAppCard from '@/components/micro-app-card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ShieldCheckIcon as ShieldIcon, AlertTriangleIcon, CheckCircleIcon } from '@/components/icons';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AnalyzeSecurityAlertsOutput {
  summary: string;
  potentialThreats?: string[];
  recommendedActions?: string[];
}

export default function AegisSecurityPage() {
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
    <div className="space-y-8">
      <MicroAppCard
        title="Aegis: AI Security Sentinel"
        icon={ShieldIcon}
        description="Aegis provides AI-powered cybersecurity. Input raw alert data below to receive a plain English summary, potential threats, and recommended actions."
      >
        <Textarea
          placeholder="Paste security alert details here... e.g., logs, error messages, SIEM output."
          value={alertDetails}
          onChange={(e) => setAlertDetails(e.target.value)}
          rows={8}
          aria-label="Security alert details input"
        />
        <Button onClick={handleAnalyze} disabled={isLoading} className="mt-4 w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
          {isLoading ? 'Analyzing...' : 'Analyze Alerts'}
          <AlertTriangleIcon className="w-4 h-4 ml-2" />
        </Button>

        {analysisResult && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-xl font-headline text-primary flex items-center">
                <CheckCircleIcon className="w-6 h-6 mr-2 text-secondary" /> AI Analysis Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[250px] pr-4 space-y-3">
                <div>
                  <h4 className="font-semibold text-md text-foreground mb-1">Summary:</h4>
                  <p className="text-foreground whitespace-pre-wrap text-sm">{analysisResult.summary}</p>
                </div>
                {analysisResult.potentialThreats && analysisResult.potentialThreats.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-md text-foreground mb-1">Potential Threats:</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {analysisResult.potentialThreats.map((threat, index) => (
                        <li key={`threat-${index}`}>{threat}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {analysisResult.recommendedActions && analysisResult.recommendedActions.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-md text-foreground mb-1">Recommended Actions:</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
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
      </MicroAppCard>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-primary flex items-center"><ShieldIcon className="w-5 h-5 mr-2"/>Proactive Defense</CardTitle>
          <CardDescription className="text-muted-foreground">Aegis continuously monitors for anomalies and provides insights into user behavior baselines, making security management effortless.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-foreground">
            <li className="flex items-center"><CheckCircleIcon className="w-4 h-4 mr-2 text-secondary"/> Contextual alerts with plain English explanations.</li>
            <li className="flex items-center"><CheckCircleIcon className="w-4 h-4 mr-2 text-secondary"/> Proactive anomaly detection.</li>
            <li className="flex items-center"><CheckCircleIcon className="w-4 h-4 mr-2 text-secondary"/> User behavior baseline insights.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
