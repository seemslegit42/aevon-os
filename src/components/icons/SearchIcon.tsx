// src/components/icons/SearchIcon.tsx
import React from 'react';
import { IconProps } from '../../../config';

export const SearchIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="116" cy="116" r="84" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <line x1="175.4" y1="175.4" x2="224" y2="224" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
  </svg>
);