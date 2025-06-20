
// src/components/icons/MoonIcon.tsx
import React from 'react';
import type { IconProps } from '../../types/icon';

export const MoonIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 256 256"
    className={className} 
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="aevosIconGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{stopColor:"#20B2AA"}} />
        <stop offset="100%" style={{stopColor:"#3EB991"}} />
      </linearGradient>
    </defs>
    <path d="M216,128A96,96,0,0,1,33.1,161.1a100.7,100.7,0,0,1-1.2-14.5A96,96,0,0,1,146.5,33.1,100.7,100.7,0,0,1,161.1,32,96,96,0,0,1,216,128Zm-29.7-22a68,68,0,0,0-42.6-42.6,72,72,0,1,1,42.6,42.6Z" fill="url(#aevosIconGradient)"/>
  </svg>
);

    