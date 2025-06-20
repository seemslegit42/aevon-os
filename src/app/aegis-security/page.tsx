
"use client";
import React, { useState } from 'react';
import MicroAppCard from '@/components/micro-app-card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { analyzeSecurityAlerts, AnalyzeSecurityAlertsInput } from '@/ai/flows/analyze-security-alerts';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function AegisSecurityPage() {
  const [alertDetails, setAlertDetails] = useState('');
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
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
      const input: AnalyzeSecurityAlertsInput = { alertDetails };
      const result = await analyzeSecurityAlerts(input);
      setAnalysisResult(result.summary);
      toast({ title: "Analysis Complete", description: "Security alert analysis successful." });
    } catch (error) {
      console.error("Error analyzing security alerts:", error);
      setAnalysisResult("Failed to analyze alerts. Please try again.");
      toast({ variant: "destructive", title: "Analysis Error", description: "Could not analyze security alerts." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <MicroAppCard
        title="Aegis: AI Security Sentinel"
        icon={Shield}
        description="Aegis provides always-on, AI-powered cybersecurity. Input raw alert data below to receive a plain English summary, potential threats, and recommended actions."
      >
        <Textarea
          placeholder="Paste security alert details here... e.g., logs, error messages, SIEM output."
          value={alertDetails}
          onChange={(e) => setAlertDetails(e.target.value)}
          rows={8}
          className="bg-background/50 dark:bg-background/50 border-primary/30 focus:ring-accent text-sm"
          aria-label="Security alert details input"
        />
        <Button onClick={handleAnalyze} disabled={isLoading} className="mt-4 w-full md:w-auto bg-primary hover:bg-primary/80 text-primary-foreground">
          {isLoading ? 'Analyzing...' : 'Analyze Alerts'}
          <AlertTriangle className="w-4 h-4 ml-2" />
        </Button>

        {analysisResult && (
          <Card className="mt-6 glassmorphism-panel">
            <CardHeader>
              <CardTitle className="text-xl font-headline text-primary flex items-center">
                <CheckCircle className="w-6 h-6 mr-2 text-secondary" /> AI Analysis Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px] pr-4">
                <p className="text-foreground whitespace-pre-wrap">{analysisResult}</p>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </MicroAppCard>

      <Card className="glassmorphism-panel">
        <CardHeader>
          <CardTitle className="font-headline text-primary flex items-center"><Shield className="w-5 h-5 mr-2"/>Proactive Defense</CardTitle>
          <CardDescription className="text-foreground/80">Aegis continuously monitors for anomalies and provides insights into user behavior baselines, making security management effortless.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-foreground/90">
            <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-secondary"/> Contextual alerts with plain English explanations.</li>
            <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-secondary"/> Proactive anomaly detection.</li>
            <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-secondary"/> User behavior baseline insights.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
