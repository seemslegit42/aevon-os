// src/components/icons/AppWindowIcon.tsx
import React from 'react';
import { IconProps } from '../../../config';

export const AppWindowIcon: React.FC<IconProps> = ({ className, size = 24, style }) => (
 <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="32" y="48" width="192" height="160" rx="8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <line x1="32" y1="88" x2="224" y2="88" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <line x1="72" y1="68" x2="72" y2="68" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" />
    <line x1="104" y1="68" x2="104" y2="68" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" />
     <line x1="136" y1="68" x2="136" y2="68" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" />
  </svg>
);