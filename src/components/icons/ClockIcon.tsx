// src/components/icons/ClockIcon.tsx
import type React from 'react';
import type { IconProps } from '../../types/icon';

export const ClockIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className}
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="16"/>
    <polyline points="128 72 128 128 184 128" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
  </svg>
);