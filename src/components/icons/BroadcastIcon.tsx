// src/components/icons/BroadcastIcon.tsx
import React from 'react';
import type { IconProps } from '../../types/icon';

export const BroadcastIcon: React.FC<IconProps> = ({ className, size = 24, style }) => (
 <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <line x1="128" y1="128" x2="128" y2="224" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <line x1="88" y1="224" x2="168" y2="224" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <path d="M128,88a72,72,0,0,1,72,72" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <path d="M128,48a112,112,0,0,1,112,112" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <circle cx="128" cy="128" r="12"/>
  </svg>
);
