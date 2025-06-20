// src/components/icons/HomeIcon.tsx
import React from 'react';
import { IconProps } from '../../../config';

export const HomeIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M218.2,109.8l-80-60a8,8,0,0,0-12.4,0l-80,60a8,8,0,0,0-4,6.5V200a16,16,0,0,0,16,16H206.2a16,16,0,0,0,16-16V116.3A8,8,0,0,0,218.2,109.8ZM128,55.5l74.2,55.7V200H169.8V144a16,16,0,0,0-16-16H102.2a16,16,0,0,0-16,16v56H53.8V111.2Z"/>
  </svg>
);