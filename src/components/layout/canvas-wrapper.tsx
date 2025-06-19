
"use client";
import React from 'react';

type CanvasWrapperProps = {
  children: React.ReactNode;
};

const CanvasWrapper: React.FC<CanvasWrapperProps> = ({ children }) => {
  return (
    <main className="flex-grow w-full p-4 md:p-8 overflow-y-auto iridescent-aurora-bg relative">
      {/* This pseudo-element creates the subtle flowing gradient lines texture */}
      <div
        className="absolute inset-0 z-0 opacity-20 dark:opacity-10"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 29px, hsl(var(--primary) / 0.1) 30px, hsl(var(--primary) / 0.1) 31px),
            repeating-linear-gradient(90deg, transparent, transparent 29px, hsl(var(--primary) / 0.1) 30px, hsl(var(--primary) / 0.1) 31px)
          `,
          backgroundSize: '30px 30px',
          animation: 'subtle-flow 20s linear infinite'
        }}
      />
      <style jsx global>{`
        @keyframes subtle-flow {
          0% { background-position: 0 0; }
          100% { background-position: 600px 600px; }
        }
      `}</style>
      <div className="relative z-10">
        {children}
      </div>
    </main>
  );
};

export default CanvasWrapper;
