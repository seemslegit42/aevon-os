// src/components/icons/LogoSymbol.tsx
import React from 'react';
import type { IconProps } from '../../types/icon';

// New AEVON OS Symbol
export const LogoSymbol: React.FC<IconProps> = ({ className, size = 32, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    className={className} 
    fill="currentColor" // Changed to currentColor for better adaptability via className
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Inspired by the provided logo image - this is an approximation */}
    <g transform="translate(5, 5) scale(0.9)">
      {/* Main flowing/interwoven part */}
      <path 
        d="M20,70 Q25,45 50,50 T75,30 
           M25,30 Q40,20 55,40 T70,75
           M45,80 Q25,85 20,65
           M75,25 Q90,30 80,50 T60,70
           M30,55 Q50,65 65,50"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        stroke="currentColor"
      />
      <path
        d="M30,70 C10,70 10,40 30,40 C50,40 50,20 70,20 C90,20 90,50 70,50 C50,50 50,70 30,70 Z
           M75,25 A10,10 0 0,1 65,35 L45,55 A10,10 0 0,0 55,65 L75,45 A10,10 0 0,1 75,25 Z
           M25,75 A10,10 0 0,0 35,65 L55,45 A10,10 0 0,1 45,35 L25,55 A10,10 0 0,0 25,75 Z
          "
        fill="currentColor"
        stroke="none"
      />
       {/* Small square dot - top right */}
      <rect x="78" y="12" width="12" height="12" rx="2" fill="currentColor" />
    </g>
  </svg>
);
