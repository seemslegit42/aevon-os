
"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGridIcon } from '@/components/icons';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <LayoutGridIcon className="w-16 h-16 mb-6 text-primary dark:text-primary-foreground" />
      <h1 className="text-4xl font-bold mb-4 font-headline text-primary dark:text-primary-foreground">
        ΛΞVON OS
      </h1>
      <p className="text-lg mb-8 text-muted-foreground dark:text-muted-foreground">
        Welcome to the ΛΞVON Operating System. The dashboard is being re-initialized.
      </p>
      <Button size="lg" className="btn-gradient-primary-accent">
        Get Started
      </Button>
       <div className="fixed bottom-4 right-4 text-xs z-[45] text-foreground/70 dark:text-neutral-400">
        <span>ΛΞVON OS v1.2 </span>
        <span className="font-semibold">GROQ</span>
      </div>
    </div>
  );
}
