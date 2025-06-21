
// src/components/icons/DollarSignIcon.tsx
import React from 'react';
import type { IconProps } from '../../types/icon';

export const DollarSignIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 256 256"
    className={className}
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <line x1="128" y1="24" x2="128" y2="232" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <path d="M176,80a40,40,0,0,0-80,0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <path d="M176,176a40,40,0,0,1-80,0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
  </svg>
);
