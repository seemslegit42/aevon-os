// src/components/icons/TargetIcon.tsx
import React from 'react';
import { IconProps } from '../../../config';

export const TargetIcon: React.FC<IconProps> = ({ className, size = 16, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="128" cy="128" r="56" opacity="0.2"/>
    <circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="16"/>
    <circle cx="128" cy="128" r="56" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="16"/>
    <line x1="128" y1="32" x2="128" y2="0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <line x1="128" y1="256" x2="128" y2="224" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <line x1="224" y1="128" x2="256" y2="128" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <line x1="0" y1="128" x2="32" y2="128" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
  </svg>
);
