// src/components/icons/BriefcaseIcon.tsx
import React from 'react';
import { IconProps } from '../../../config';

export const BriefcaseIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="32" y="72" width="192" height="144" rx="8" opacity="0.2"/>
    <rect x="32" y="72" width="192" height="144" rx="8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <path d="M80,72V48a24,24,0,0,1,24-24h48a24,24,0,0,1,24,24V72" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <line x1="32" y1="120" x2="224" y2="120" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
  </svg>
);
