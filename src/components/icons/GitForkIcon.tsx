// src/components/icons/GitForkIcon.tsx
import React from 'react';
import type { IconProps } from '../../types/icon';

export const GitForkIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className}
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="aevosIconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6A0DAD" />
        <stop offset="50%" stopColor="#3EB991" />
        <stop offset="100%" stopColor="#20B2AA" />
      </linearGradient>
    </defs>
    <circle cx="64" cy="64" r="24" fill="none" stroke="url(#aevosIconGradient)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <circle cx="64" cy="192" r="24" fill="none" stroke="url(#aevosIconGradient)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <circle cx="192" cy="128" r="24" fill="none" stroke="url(#aevosIconGradient)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <line x1="64" y1="88" x2="64" y2="168" fill="none" stroke="url(#aevosIconGradient)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <path d="M64,168a64,64,0,0,0,64,64h0" fill="none" stroke="url(#aevosIconGradient)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <path d="M128,64a64,64,0,0,1,64,64V232" fill="none" stroke="url(#aevosIconGradient)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
  </svg>
);
