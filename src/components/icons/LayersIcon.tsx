// src/components/icons/LayersIcon.tsx
import React from 'react';
import type { IconProps } from '../../types/icon';

export const LayersIcon: React.FC<IconProps> = ({ className, size = 24, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="32" y="104" width="192" height="104" rx="8" opacity="0.2"/>
    <rect x="32" y="104" width="192" height="104" rx="8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <path d="M64,104V72a8,8,0,0,1,8-8H184a8,8,0,0,1,8,8v32" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <path d="M96,104V48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v56" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
  </svg>
);
