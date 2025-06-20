
// src/components/icons/ChevronDownIcon.tsx
import React from 'react';
import type { IconProps } from '../../types/icon';

export const ChevronDownIcon: React.FC<IconProps> = ({ className, size = 16, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={`aevos-icon-styling-override ${className || ''}`}
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="aevosIconGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{stopColor:"#20B2AA"}} />
        <stop offset="100%" style={{stopColor:"#3EB991"}} />
      </linearGradient>
    </defs>
    <polyline points="208 96 128 176 48 96" fill="none" stroke="url(#aevosIconGradient)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
  </svg>
);

    