// src/components/icons/PauseIcon.tsx
import React from 'react';
import { IconProps } from '../../../config';

export const PauseIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="64" y="48" width="40" height="160" rx="8" opacity="0.2"/>
    <rect x="152" y="48" width="40" height="160" rx="8" opacity="0.2"/>
    <rect x="64" y="48" width="40" height="160" rx="8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <rect x="152" y="48" width="40" height="160" rx="8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
  </svg>
);