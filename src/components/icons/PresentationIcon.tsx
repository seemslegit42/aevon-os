// src/components/icons/PresentationIcon.tsx
import React from 'react';
import type { IconProps } from '../../types/icon';

export const PresentationIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="32" y="48" width="192" height="136" rx="8" opacity="0.2"/>
    <line x1="160" y1="224" x2="96" y2="224" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <line x1="128" y1="184" x2="128" y2="224" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <rect x="32" y="48" width="192" height="136" rx="8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <path d="M64,80H192l-27.2,40.9a7.9,7.9,0,0,1-13.6,0L128,88,100.3,124.5a7.9,7.9,0,0,1-13.6,0Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
  </svg>
);
