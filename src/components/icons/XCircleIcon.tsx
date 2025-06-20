// src/components/icons/XCircleIcon.tsx
import React from 'react';
import type { IconProps } from '../../types/icon';

export const XCircleIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor" // Will take the color from text-red-400 etc.
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Optional: faint background circle if needed, but usually for an X, it's just the X in a circle shape */}
    {/* <circle cx="128" cy="128" r="96" opacity="0.1" fill="currentColor"/> */}
    <path d="M128,24A104,104,0,1,0,232,128,104.2,104.2,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm37.7-119.1a8.1,8.1,0,0,0-11.4,0L128,124.7l-26.3-26.4a8.1,8.1,0,0,0-11.4,0,8.1,8.1,0,0,0,0,11.4L116.7,128l-26.4,26.3a8.1,8.1,0,0,0,0,11.4,8.2,8.2,0,0,0,11.4,0L128,139.3l26.3,26.4a8.2,8.2,0,0,0,11.4,0,8.1,8.1,0,0,0,0-11.4L139.3,128l26.4-26.3A8.1,8.1,0,0,0,165.7,96.9Z" fill="currentColor"/>
  </svg>
);
