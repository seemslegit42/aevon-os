
"use client";
import React from 'react';
import { BrainCircuitIcon } from '@/components/icons'; // Or a more fitting icon like BarChartBigIcon

const AiInsightsCardContent: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <BrainCircuitIcon className="w-12 h-12 text-primary mb-3" />
      <h3 className="text-md font-headline text-primary-foreground mb-1">AI-Powered Insights</h3>
      <p className="text-xs text-muted-foreground">
        Personalized recommendations and data-driven intelligence will dynamically appear here based on your OS activity.
      </p>
      <p className="text-xs text-muted-foreground mt-2">
        Currently monitoring for actionable insights...
      </p>
    </div>
  );
};

export default AiInsightsCardContent;
