
"use client";
import React from 'react';
import { cn } from '@/lib/utils';

type CanvasWrapperProps = {
  children: React.ReactNode;
};

const CanvasWrapper: React.FC<CanvasWrapperProps> = ({ children }) => {
  return (
    <main
      className={cn(
        "flex-grow w-full p-4 md:p-8 overflow-y-auto relative text-foreground"
        // Removed iridescent background classes: "iridescent-purple-bg-light dark:iridescent-purple-bg-dark"
      )}
    >
      <div className="relative z-10 h-full">
        {children}
      </div>
    </main>
  );
};

export default CanvasWrapper;
