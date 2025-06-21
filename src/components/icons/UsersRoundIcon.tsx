
// src/components/icons/UsersRoundIcon.tsx
import React from 'react';
import type { IconProps } from '../../types/icon';

export const UsersRoundIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M228,140a64,64,0,0,1-50.6,61.9" opacity="0.2"/>
    <path d="M28,140a64,64,0,0,0,50.6,61.9" opacity="0.2"/>
    <circle cx="128" cy="100" r="40" opacity="0.2"/>
    <path d="M78.6,201.9A64.1,64.1,0,0,0,28,140a63.6,63.6,0,0,0-4.3,24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <path d="M177.4,201.9A64.1,64.1,0,0,1,228,140a63.6,63.6,0,0,1,4.3,24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <path d="M152.9,132.2a40,40,0,1,0-49.8,0A72,72,0,0,0,32,200H224A72,72,0,0,0,152.9,132.2Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
  </svg>
);
