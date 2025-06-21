
// src/components/icons/CopyIcon.tsx
import React from 'react';
import type { IconProps } from '../../types/icon';

export const CopyIcon: React.FC<IconProps> = ({ className, size = 16, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="40" y="80" width="128" height="128" rx="8" opacity="0.2"/>
    <path d="M216,40H88a8,8,0,0,0-8,8V80h40a8,8,0,0,1,8,8v40h40a8,8,0,0,1,8,8v40h32a8,8,0,0,0,8-8V48A8,8,0,0,0,216,40Z" opacity="0.2"/>
    <path d="M216,32H88a16,16,0,0,0-16,16V80H40a16,16,0,0,0-16,16v88a16,16,0,0,0,16,16H168a16,16,0,0,0,16-16V168h32a16,16,0,0,0,16-16V48A16,16,0,0,0,216,32ZM168,192H40V96H168Z" fill="currentColor"/>
  </svg>
);
