
"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BrainCircuitIcon, ArrowRightIcon } from '@/components/icons';

/**
 * This component now serves as a placeholder and informational link to the main AI Insights page.
 * See /src/app/ai-insights/page.tsx for the new implementation.
 */
const AiInsightsCardContent: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <BrainCircuitIcon className="w-12 h-12 text-primary mb-4" />
      <h3 className="font-semibold text-lg text-foreground">AI Insights Hub</h3>
      <p className="text-sm text-muted-foreground my-2">
        This panel has been upgraded to a full-page experience for more detailed analysis.
      </p>
      <Button asChild variant="outline" size="sm" className="mt-4">
        <Link href="/ai-insights">
          Go to Insights Hub <ArrowRightIcon className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
};

export default AiInsightsCardContent;
