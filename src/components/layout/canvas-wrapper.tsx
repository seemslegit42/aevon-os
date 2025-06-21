
"use client";
import React from 'react';
import { cn } from '@/lib/utils';
import BackgroundGlyphs from './background-glyphs';

type CanvasWrapperProps = {
  children: React.ReactNode;
};

/**
 * The main content area of the OS. It's a relative container
 * that holds the background effects and the main children content
 * (the dashboard itself).
 */
const CanvasWrapper: React.FC<CanvasWrapperProps> = ({ children }) => {
  return (
    <main
      className={cn(
        "flex-grow w-full relative"
      )}
    >
      {/* Background effects are positioned absolutely to fill this container */}
      <BackgroundGlyphs />
      <div className="canvas-aurora-background-dark-container"></div>
      
      {/* 
        The main content (Dashboard) is also positioned absolutely to fill the container.
        This ensures it sits on top of the background layers and occupies the full space.
      */}
      <div className="absolute inset-0 z-10">
        {children}
      </div>
    </main>
  );
};

export default CanvasWrapper;
