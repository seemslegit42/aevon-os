
"use client";
import React from 'react';
import { BrainCircuitIcon } from '@/components/icons'; 

const AiInsightsCardContent: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <BrainCircuitIcon className="w-12 h-12 text-primary mb-3" />
      <h3 className="text-md font-headline text-primary-foreground mb-1">Adaptive AI Insights</h3>
      <p className="text-xs text-muted-foreground">
        The AI Insights Engine continuously learns from your activities across all ΛΞVON OS modules. 
        It proactively identifies patterns, anticipates needs, and delivers predictive intelligence to optimize your operations. 
        Expect dynamic, context-aware insights here.
      </p>
    </div>
  );
};

export default AiInsightsCardContent;
