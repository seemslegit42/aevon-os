// src/components/icons/ChevronDownIcon.tsx
import React from 'react';
import { IconProps } from '../../../config';

export const ChevronDownIcon: React.FC<IconProps> = ({ className, size = 16, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={`${className} chevron-animated`} // Keep chevron-animated if used for CSS animation
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <polyline points="208 96 128 176 48 96" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
  </svg>
);