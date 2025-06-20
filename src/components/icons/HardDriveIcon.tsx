// src/components/icons/HardDriveIcon.tsx
import React from 'react';
import type { IconProps } from '../../types/icon';

export const HardDriveIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 256 256"
    className={className}
    fill="currentColor" 
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <line x1="64" y1="160" x2="64" y2="160" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <path d="M40,96H216a0,0,0,0,1,0,0v64a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V96A0,0,0,0,1,40,96Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <line x1="64" y1="128" x2="64" y2="128" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
  </svg>
);
