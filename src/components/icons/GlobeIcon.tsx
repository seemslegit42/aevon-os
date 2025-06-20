// src/components/icons/GlobeIcon.tsx
import React from 'react';
import type { IconProps } from '../../types/icon';

export const GlobeIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="128" cy="128" r="96" opacity="0.2"/>
    <circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="16"/>
    <line x1="37.5" y1="96" x2="218.5" y2="96" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <line x1="37.5" y1="160" x2="218.5" y2="160" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <ellipse cx="128" cy="128" rx="40" ry="93.4" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="16"/>
  </svg>
);
