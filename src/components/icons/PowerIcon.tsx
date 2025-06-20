// src/components/icons/PowerIcon.tsx
import React from 'react';
import type { IconProps } from '../../types/icon';

export const PowerIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 256 256"
    className={className}
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M128,32a96,96,0,1,0,96,96A96,96,0,0,0,128,32Zm0,176a80,80,0,1,1,80-80A80.1,80.1,0,0,1,128,208Z" opacity="0.2"/>
    <path d="M165.2,56.2a88.1,88.1,0,0,0-74.4,0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <line x1="128" y1="24" x2="128" y2="104" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <path d="M128,32a96,96,0,1,0,96,96A96,96,0,0,0,128,32Zm0,176a80,80,0,1,1,80-80A80.1,80.1,0,0,1,128,208Z" fill="currentColor"/>
  </svg>
);
