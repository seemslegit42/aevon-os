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
    <path d="M223.8,136.6A95.9,95.9,0,0,1,32.3,136.2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <polyline points="223.7 96.3 223.7 136.3 183.7 136.3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <path d="M32.2,119.4A95.9,95.9,0,0,1,223.7,119.8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <polyline points="32.3 159.7 32.3 119.7 72.3 119.7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
  </svg>
);
