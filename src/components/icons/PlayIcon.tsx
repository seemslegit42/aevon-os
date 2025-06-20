// src/components/icons/PlayIcon.tsx
import React from 'react';
import type { IconProps } from '../../types/icon';

export const PlayIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M240,128a15.8,15.8,0,0,1-7.8,13.7L54.8,241.7C46.3,246.7,32,240.3,32,224V32c0-16.3,14.3-22.7,22.8-17.7l177.4,98.3A15.8,15.8,0,0,1,240,128Z" opacity="0.2"/>
    <path d="M240,128a15.8,15.8,0,0,1-7.8,13.7L54.8,241.7C46.3,246.7,32,240.3,32,224V32c0-16.3,14.3-22.7,22.8-17.7l177.4,98.3A15.8,15.8,0,0,1,240,128Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
  </svg>
);
