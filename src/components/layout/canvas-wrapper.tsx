
"use client";
import React from 'react';
import { cn } from '@/lib/utils';
import BackgroundGlyphs from './background-glyphs';

type CanvasWrapperProps = {
  children: React.ReactNode;
};

const CanvasWrapper: React.FC<CanvasWrapperProps> = ({ children }) => {
  return (
    <main
      className={cn(
        "flex-grow w-full overflow-y-auto relative text-foreground pt-20" // Added pt-20 to account for fixed TopBar height
      )}
    >
      <BackgroundGlyphs />
      {/* This container will hold the gradient and the dark overlay for dark mode */}
      <div className="canvas-aurora-background-dark-container"></div>
      
      <div className="relative z-10 h-full"> {/* Main content, z-index ensures it's on top */}
        {children}
      </div>
    </main>
  );
};

export default CanvasWrapper;
