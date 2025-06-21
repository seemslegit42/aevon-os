
// src/components/icons/LaptopIcon.tsx
import React from 'react';
import type { IconProps } from '../../types/icon';

export const LaptopIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M232,162.7V88a16,16,0,0,0-16-16H40A16,16,0,0,0,24,88v74.7" opacity="0.2"/>
    <path d="M248,162.7A16,16,0,0,1,232,176H24a16,16,0,0,1-16-13.3V88A24.1,24.1,0,0,1,32,64H224a24.1,24.1,0,0,1,24,24v74.7Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <rect x="40" y="72" width="176" height="104" rx="16" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <line x1="16" y1="208" x2="240" y2="208" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
  </svg>
);
