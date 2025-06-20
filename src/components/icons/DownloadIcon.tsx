// src/components/icons/DownloadIcon.tsx
import React from 'react';
import type { IconProps } from '../../types/icon';

export const DownloadIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M208,144v56a8,8,0,0,1-8,8H56a8,8,0,0,1-8-8V144" opacity="0.2"/>
    <path d="M208,144v56a8,8,0,0,1-8,8H56a8,8,0,0,1-8-8V144" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <polyline points="88 104 128 144 168 104" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <line x1="128" y1="40" x2="128" y2="144" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
  </svg>
);
