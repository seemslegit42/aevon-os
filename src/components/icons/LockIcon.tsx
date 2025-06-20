// src/components/icons/LockIcon.tsx
import React from 'react';
import type { IconProps } from '../../types/icon';

export const LockIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="40" y="88" width="176" height="128" rx="8" opacity="0.2"/>
    <rect x="40" y="88" width="176" height="128" rx="8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <path d="M88,88V56a40,40,0,0,1,80,0V88" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <circle cx="128" cy="152" r="12"/>
  </svg>
);
