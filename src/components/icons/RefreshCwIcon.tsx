
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
    <path d="M232,128A104.3,104.3,0,0,1,85,226.3a8.1,8.1,0,0,1-1-11.3,8,8,0,0,1,11.3-1,88.1,88.1,0,0,0,114.8-98.2,8,8,0,1,1,14.2-7.6A103.2,103.2,0,0,1,232,128Z" opacity="0.2"/>
    <path d="M235,91.4a8.1,8.1,0,0,0-9.4-5.1,8.4,8.4,0,0,0-5.1,9.5,88.1,88.1,0,0,1-139.8,82.5,8,8,0,0,0-11.3,1,8.1,8.1,0,0,0-1,11.3A104,104,0,0,0,232,128a103.2,103.2,0,0,0-4.2-27.9A8.3,8.3,0,0,0,235,91.4Zm-45.7-2.8A8,8,0,0,0,176,80a8.2,8.2,0,0,0-7.6,4.8,88.1,88.1,0,0,0-114.8,98.2,8,8,0,1,0,12.3,10.2A72.1,72.1,0,0,1,176.2,96.2,8,8,0,0,0,189.3,88.6Z" fill="currentColor"/>
  </svg>
);
