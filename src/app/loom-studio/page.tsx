
"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Settings2Icon as LoomIcon } from '@/components/icons'; // Renamed for clarity

export default function LoomStudioPageStub() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <LoomIcon className="w-16 h-16 mb-6 text-primary" />
      <h1 className="text-4xl font-bold mb-4 font-headline text-primary-foreground">
        Loom Studio
      </h1>
      <p className="text-lg mb-8 text-muted-foreground">
        This is the dedicated route for Loom Studio. Functionality is primarily accessed as a draggable panel within the main ΛΞVON OS dashboard.
      </p>
      <p className="text-sm text-muted-foreground mb-8">
        Loom Studio provides a visual workspace for designing, testing, and orchestrating complex AI workflows and prompt chains.
      </p>
      <Button size="lg" asChild className="btn-gradient-primary-accent">
        <Link href="/">Go to Dashboard</Link>
      </Button>
    </div>
  );
}
