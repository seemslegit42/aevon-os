
"use client";
import React from 'react';

type CanvasWrapperProps = {
  children: React.ReactNode;
};

const CanvasWrapper: React.FC<CanvasWrapperProps> = ({ children }) => {
  return (
    // Removed iridescent-aurora-bg, main background is now controlled by body styles
    // Also removed the inner div with the grid pattern to match the solid background of the reference image
    <main className="flex-grow w-full p-4 md:p-8 overflow-y-auto relative">
      <div className="relative z-10">
        {children}
      </div>
    </main>
  );
};

export default CanvasWrapper;

