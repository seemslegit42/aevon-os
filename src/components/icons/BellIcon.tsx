
// src/components/icons/BellIcon.tsx
import React from 'react';
import type { IconProps } from '../../types/icon';

export const BellIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
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
    <path d="M221.8,175.8A32.2,32.2,0,0,0,224,160a32,32,0,0,0-32-32,3.9,3.9,0,0,1-3.8-3.8c0-23.2-22.3-48.4-50.2-48.4S88,99,88,124.2a3.9,3.9,0,0,1-3.8,3.8,32,32,0,0,0-32,32,32.2,32.2,0,0,0,2.2,15.8C36.8,197.9,24,204,24,204H232S219.2,197.9,221.8,175.8Z" fill="none" stroke="url(#aevosIconGradient)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <path d="M104,224a24,24,0,0,0,48,0" fill="none" stroke="url(#aevosIconGradient)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
  </svg>
);

    