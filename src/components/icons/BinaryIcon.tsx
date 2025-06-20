// src/components/icons/BinaryIcon.tsx
import React from 'react';
import { IconProps } from '../../../config';

export const BinaryIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="40" y="40" width="80" height="80" rx="8" opacity="0.2"/>
    <rect x="136" y="136" width="80" height="80" rx="8" opacity="0.2"/>
    <rect x="40" y="40" width="80" height="80" rx="8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <rect x="136" y="136" width="80" height="80" rx="8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <line x1="88" y1="120" x2="88" y2="168" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <line x1="168" y1="88" x2="168" y2="136" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <line x1="128" y1="128" x2="168" y2="88" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <line x1="88" y1="168" x2="128" y2="128" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
  </svg>
);