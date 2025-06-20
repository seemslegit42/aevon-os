// src/components/icons/LogInIcon.tsx
import React from 'react';
import type { IconProps } from '../../types/icon';

export const LogInIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M128,24A104,104,0,1,0,232,128,104.2,104.2,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Z" opacity="0.2"/>
    <path d="M128,24A104,104,0,1,0,232,128,104.2,104.2,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm40-88a8,8,0,0,1-8,8H107.3l18.4,18.3a8.1,8.1,0,0,1,0,11.4,8.2,8.2,0,0,1-11.4,0l-32-32a8.1,8.1,0,0,1,0-11.4l32-32a8.1,8.1,0,0,1,11.4,11.4L107.3,120H160A8,8,0,0,1,168,128Z" fill="currentColor"/>
  </svg>
);
