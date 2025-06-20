// src/components/icons/CreditCardIcon.tsx
import React from 'react';
import { IconProps } from '../../../config';

export const CreditCardIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="32" y="48" width="192" height="160" rx="16" opacity="0.2"/>
    <rect x="32" y="48" width="192" height="160" rx="16" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <line x1="32" y1="96" x2="224" y2="96" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <line x1="80" y1="152" x2="120" y2="152" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
  </svg>
);
