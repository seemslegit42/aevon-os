// src/components/icons/MinimizeIcon.tsx
import React from 'react';
import type { IconProps } from '../../types/icon';

export const MinimizeIcon: React.FC<IconProps> = ({ className, size = 18, style }) => ( 
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <line x1="40" y1="128" x2="216" y2="128" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
  </svg>
);
