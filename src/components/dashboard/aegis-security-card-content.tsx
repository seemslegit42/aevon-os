
"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ShieldCheckIcon } from '@/components/icons';
import { useToast } from "@/hooks/use-toast";

const AegisSecurityCardContent: React.FC = () => {
  const [alertDetails, setAlertDetails] = useState('');
  const { toast } = useToast();

  const handleAnalyze = async () => {
    // This functionality is disabled as Genkit is not used in this project.
    toast({ 
        variant: "destructive", 
        title: "Feature Disabled", 
        description: "AI analysis is not configured for this application." 
    });
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
      <Button onClick={handleAnalyze} disabled={true} className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0">
        Analyze Alerts (Disabled)
        <ShieldCheckIcon className="w-4 h-4 ml-2" />
      </Button>

      <div className="flex-grow min-h-0">
          <div className="flex-grow flex h-full items-center justify-center text-muted-foreground text-center">
              <p className="text-sm">AI analysis is not configured.</p>
          </div>
       </div>
    </div>
  );
};

export default AegisSecurityCardContent;
