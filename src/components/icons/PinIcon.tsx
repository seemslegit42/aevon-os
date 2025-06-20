// src/components/icons/PinIcon.tsx
import React from 'react';
import { IconProps } from '../../../config';

export const PinIcon: React.FC<IconProps> = ({ className, size = 18, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <line x1="128" y1="176" x2="128" y2="240" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <line x1="168" y1="240" x2="88" y2="240" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <path d="M208,104c0,44.2-41.5,88-80,88S48,148.2,48,104a80,80,0,0,1,160,0Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <line x1="208" y1="104" x2="48" y2="104" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <path d="M160,104V56a32,32,0,0,0-64,0v48" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
  </svg>
);