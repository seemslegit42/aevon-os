"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MagicWandIcon } from '@/components/icons';

export default function BeepPageStub() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <MagicWandIcon className="w-16 h-16 mb-6 text-primary" />
      <h1 className="text-4xl font-bold mb-4 font-headline text-primary-foreground">
        BEEP Interface
      </h1>
      <p className="text-lg mb-8 text-muted-foreground">
        This is the dedicated route for the BEEP Interface. Functionality is primarily accessed as a draggable panel within the main ΛΞVON OS dashboard.
      </p>
      <p className="text-sm text-muted-foreground mb-8">
        BEEP (Behavioral Event & Execution Processor) is your natural language interface for tasking, information retrieval, and personalized briefings.
      </p>
      <Button size="lg" asChild className="btn-gradient-primary-accent">
        <Link href="/">Go to Dashboard</Link>
      </Button>
    </div>
  );
}
