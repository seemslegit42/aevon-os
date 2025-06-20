// src/components/icons/UserIcon.tsx
import React from 'react';
import { IconProps } from '../../../config';

export const UserIcon: React.FC<IconProps> = ({ className, size = 24, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="128" cy="96" r="64" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="16"/>
    <path d="M30.989,215.99062a112.03731,112.03731,0,0,1,194.02311.002" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
  </svg>
);