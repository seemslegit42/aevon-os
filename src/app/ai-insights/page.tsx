
"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BrainCircuitIcon, ArrowLeftIcon } from '@/components/icons';

export default function AiInsightsPageStub() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <BrainCircuitIcon className="w-16 h-16 mb-6 text-primary" />
      <h1 className="text-4xl font-bold mb-4 font-headline text-primary-foreground">
        AI Insights
      </h1>
      <p className="text-lg mb-8 text-muted-foreground max-w-2xl">
        This is the dedicated page for AI Insights. Functionality is primarily accessed via the dashboard card.
      </p>
      <Button size="lg" asChild className="btn-gradient-primary-accent">
        <Link href="/">
            <ArrowLeftIcon />
            Back to Home
        </Link>
      </Button>
    </div>
  );
}

