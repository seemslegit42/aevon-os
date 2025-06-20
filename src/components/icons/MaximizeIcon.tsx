// src/components/icons/MaximizeIcon.tsx
import React from 'react';
import { IconProps } from '../../../config';

export const MaximizeIcon: React.FC<IconProps> = ({ className, size = 18, style }) => ( 
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="40" y="40" width="176" height="176" rx="8" strokeWidth="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);