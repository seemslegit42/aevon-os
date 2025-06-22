// src/components/icons/ShieldCheckIcon.tsx
import type React from 'react';
import type { IconProps } from '../../types/icon';

export const ShieldCheckIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className}
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Shield body with current color */}
    <path d="M208,40H48A24.1,24.1,0,0,0,24,64V136c0,61.9,44.5,95.1,94.2,110.6a23.8,23.8,0,0,0,19.6,0c49.7-15.5,94.2-48.7,94.2-110.6V64A24.1,24.1,0,0,0,208,40Z" fill="currentColor"/>
    {/* Checkmark in white */}
    <polyline points="111.9 148.1 143.9 116.1 132.1 103.9 100.1 135.9 80 115.9 68.1 127.9 100.1 159.9 111.9 148.1" fill="#FFFFFF"/>
  </svg>
);
