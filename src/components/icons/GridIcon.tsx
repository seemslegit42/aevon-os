// src/components/icons/GridIcon.tsx
import React from 'react';
import type { IconProps } from '../../types/icon';

export const GridIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="40" y="40" width="72" height="72" rx="8" opacity="0.2"/>
    <rect x="144" y="40" width="72" height="72" rx="8" opacity="0.2"/>
    <rect x="40" y="144" width="72" height="72" rx="8" opacity="0.2"/>
    <rect x="144" y="144" width="72" height="72" rx="8" opacity="0.2"/>
    <rect x="40" y="40" width="72" height="72" rx="8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <rect x="144" y="40" width="72" height="72" rx="8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <rect x="40" y="144" width="72" height="72" rx="8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <rect x="144" y="144" width="72" height="72" rx="8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
  </svg>
);
