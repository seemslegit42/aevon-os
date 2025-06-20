
// src/components/icons/FilterIcon.tsx
import React from 'react';
import type { IconProps } from '../../types/icon';

export const FilterIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M232,56H24a7.9,7.9,0,0,0-5.5,13.5L84,135v65a7.9,7.9,0,0,0,4.6,7.2,8.1,8.1,0,0,0,8.4-.2l32-32A8,8,0,0,0,132,168V135l65.5-65.5A7.9,7.9,0,0,0,232,56Zm-16,16L156,132.2a15.7,15.7,0,0,0-4.6,11.3v35l-24,24V143.5a15.7,15.7,0,0,0-4.6-11.3L60,72Z" fill="currentColor"/>
  </svg>
);
