
"use client";
import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

type CanvasWrapperProps = {
  children: React.ReactNode;
};

/**
 * The main content area of the OS. It's a relative container
 * that holds the background effects and the main children content
 * (the dashboard itself).
 */
const CanvasWrapper: React.FC<CanvasWrapperProps> = ({ children }) => {
  const isMobile = useIsMobile();
  return (
    <main
      className={cn(
        "flex-grow w-full relative",
        isMobile ? "overflow-y-auto" : "overflow-hidden" // Make the main canvas scrollable on mobile
      )}
    >
      {/* Background effects are positioned absolutely to fill this container */}
      <div className="canvas-aurora-background-dark-container"></div>
      
      {/* 
        The main content (Dashboard) is also positioned absolutely to fill the container.
        This ensures it sits on top of the background layers and occupies the full space.
      */}
      <div className={cn("z-10 w-full", isMobile ? "h-auto" : "absolute inset-0 h-full")}>
        {children}
      </div>
    </main>
  );
};

export default CanvasWrapper;
