// src/components/icons/ShieldCheckIcon.tsx
import React from 'react';
import type { IconProps } from '../../types/icon';

export const ShieldCheckIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M208,48H48A16,16,0,0,0,32,64V136c0,54.4,40.4,85.7,90.1,100.3a15.7,15.7,0,0,0,11.8,0C175.6,221.7,216,190.4,216,136V64A16,16,0,0,0,208,48Z" opacity="0.2"/>
    <path d="M208,40H48A24.1,24.1,0,0,0,24,64V136c0,61.9,44.5,95.1,94.2,110.6a23.8,23.8,0,0,0,19.6,0c49.7-15.5,94.2-48.7,94.2-110.6V64A24.1,24.1,0,0,0,208,40Zm0,96c0,51.4-36.2,79.4-80,93.2-43.8-13.8-80-41.8-80-93.2V64H208Z" fill="currentColor"/>
    <polyline points="111.9 148.1 143.9 116.1 132.1 103.9 100.1 135.9 80 115.9 68.1 127.9 100.1 159.9 111.9 148.1" fill="currentColor"/>
  </svg>
);
