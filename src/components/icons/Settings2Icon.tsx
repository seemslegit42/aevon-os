
// src/components/icons/Settings2Icon.tsx
import React from 'react';
import type { IconProps } from '../../types/icon';

export const Settings2Icon: React.FC<IconProps> = ({ className, size = 20, style }) => (
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
    <rect x="24" y="104" width="208" height="48" rx="8" fill="none" stroke="url(#aevosIconGradient)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <path d="M100,176a28,28,0,1,1,28-28A28.1,28.1,0,0,1,100,176Z" fill="none" stroke="url(#aevosIconGradient)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <path d="M100,80a28,28,0,1,1,28-28A28.1,28.1,0,0,1,100,80Z" fill="none" stroke="url(#aevosIconGradient)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
  </svg>
);

    