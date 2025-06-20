
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
        "flex-grow w-full p-4 md:p-0 overflow-y-auto relative text-foreground"
        // Removed direct background classes from here, will be handled by .dark on body
        // and the aurora container for dark mode.
      )}
    >
      {/* This container will hold the gradient and the dark overlay for dark mode */}
      <div className="canvas-aurora-background-dark-container"></div>
      
      <div className="relative z-10 h-full"> {/* Main content, z-index ensures it's on top */}
        {children}
      </div>
    </main>
  );
};

export default CanvasWrapper;
