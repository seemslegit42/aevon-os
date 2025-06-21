
"use client";

import React from 'react';
import { BinaryIcon, GitForkIcon, CpuIcon, Share2Icon, LayersIcon, DatabaseZapIcon, SlidersHorizontalIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

// A mix of circuit-like icons and soft radial gradients for the background effect.
const glyphs = [
  // Icon Glyphs
  { Component: BinaryIcon, className: 'top-[10%] left-[15%] w-24 h-24', animationDelay: '0s' },
  { Component: GitForkIcon, className: 'top-[20%] right-[10%] w-32 h-32', animationDelay: '2.5s' },
  { Component: CpuIcon, className: 'bottom-[5%] left-[5%] w-20 h-20', animationDelay: '5s' },
  { Component: Share2Icon, className: 'bottom-[15%] right-[20%] w-28 h-28', animationDelay: '7.5s' },
  { Component: LayersIcon, className: 'top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-48 h-48', animationDelay: '1s' },
  { Component: DatabaseZapIcon, className: 'top-[75%] left-[25%] w-24 h-24', animationDelay: '4s' },
  { Component: SlidersHorizontalIcon, className: 'top-[80%] right-[35%] w-20 h-20', animationDelay: '6.5s' },
  { Component: GitForkIcon, className: 'top-[5%] right-[30%] w-16 h-16', animationDelay: '8s' },
  // Radial Gradient Divs
  { Component: 'div', className: 'bottom-[30%] left-[40%] h-40 w-40 rounded-full bg-primary/50', animationDelay: '3s' },
  { Component: 'div', className: 'top-[35%] left-[20%] h-56 w-56 rounded-full bg-secondary/50', animationDelay: '9s' },
];

/**
 * Renders a set of subtly animating glyphs in the background.
 * It's positioned behind all other content and does not intercept pointer events.
 */
const BackgroundGlyphs: React.FC = () => {
  return (
    <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none">
      {glyphs.map(({ Component, className, animationDelay }, index) => (
        <Component
          key={index}
          className={cn(
            'absolute text-primary/50 opacity-0 glyph-pulse-animate',
            className
          )}
          style={{ animationDelay }}
        />
      ))}
    </div>
  );
};

export default BackgroundGlyphs;
