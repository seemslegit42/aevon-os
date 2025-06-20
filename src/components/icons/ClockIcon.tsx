
// src/components/icons/ClockIcon.tsx
import React from 'react';
import type { IconProps } from '../../types/icon';

export const ClockIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={`aevos-icon-style ${className || ''}`}
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="aevosIconGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{stopColor:"#20B2AA"}} />
        <stop offset="100%" style={{stopColor:"#3EB991"}} />
      </linearGradient>
    </defs>
    <circle cx="128" cy="128" r="96" fill="none" stroke="url(#aevosIconGradient)" strokeMiterlimit="10" strokeWidth="16"/>
    <polyline points="128 72 128 128 184 128" fill="none" stroke="url(#aevosIconGradient)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
  </svg>
);
