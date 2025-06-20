
"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CreditCardIcon as ArmoryIcon } from '@/components/icons'; // Renamed for clarity

export default function ArmoryPageStub() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <ArmoryIcon className="w-16 h-16 mb-6 text-primary" />
      <h1 className="text-4xl font-bold mb-4 font-headline text-primary-foreground">
        ΛΞVON Λrmory
      </h1>
      <p className="text-lg mb-8 text-muted-foreground">
        This is the dedicated route for the ΛΞVON Λrmory. Functionality is primarily accessed as a draggable panel within the main ΛΞVON OS dashboard.
      </p>
      <p className="text-sm text-muted-foreground mb-8">
        The Armory is a marketplace to discover, acquire, and manage AI micro-apps and intelligent agents for your ΛΞVON OS.
      </p>
      <Button size="lg" asChild className="btn-gradient-primary-accent">
        <Link href="/">Go to Dashboard</Link>
      </Button>
    </div>
  );
}
