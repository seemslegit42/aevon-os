// src/components/icons/CheckCircleIcon.tsx
import React from 'react';
import { IconProps } from '../../../config';

export const CheckCircleIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="16"/>
    <polyline points="172 104 113.3 160 84 132" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
  </svg>
);