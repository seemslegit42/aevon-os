// src/components/icons/MoreHorizontalIcon.tsx
import React from 'react';
import type { IconProps } from '../../types/icon';

export const MoreHorizontalIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="128" cy="128" r="12"/>
    <circle cx="192" cy="128" r="12"/>
    <circle cx="64" cy="128" r="12"/>
  </svg>
);
