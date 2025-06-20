
// src/components/icons/RefreshCwIcon.tsx
import React from 'react';
import type { IconProps } from '../../types/icon';

export const RefreshCwIcon: React.FC<IconProps> = ({ className, size = 16, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M224.2,137.8A95.9,95.9,0,0,1,128,224a96,96,0,0,1-65.8-167.8" opacity="0.2"/>
    <path d="M176,40a8,8,0,0,0-8,8V76.1A95.7,95.7,0,0,0,32.5,120a8,8,0,0,0,15,5.4,80,80,0,0,1,129-52.8L152,97.2a8,8,0,0,0,10.2,13.6l48-24a8.1,8.1,0,0,0,3.8-11Z" fill="currentColor"/>
    <path d="M80,216a8,8,0,0,0,8-8V179.9a95.7,95.7,0,0,0,135.5-48.1,8,8,0,0,0-15-5.4,80,80,0,0,1-129,52.8L104,158.8a8,8,0,0,0-10.2-13.6l-48,24a8.1,8.1,0,0,0-3.8,11Z" fill="currentColor"/>
  </svg>
);
