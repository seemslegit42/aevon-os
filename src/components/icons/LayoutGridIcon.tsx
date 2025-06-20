// src/components/icons/LayoutGridIcon.tsx
import React from 'react';
import { IconProps } from '../../../config';

export const LayoutGridIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
 <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="48" y="48" width="60" height="60" rx="8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <rect x="148" y="48" width="60" height="60" rx="8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <rect x="48" y="148" width="60" height="60" rx="8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <rect x="148" y="148" width="60" height="60" rx="8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
  </svg>
);