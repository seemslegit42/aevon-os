// src/components/icons/Share2Icon.tsx
import React from 'react';
import { IconProps } from '../../../config';

export const Share2Icon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="184" cy="64" r="24" opacity="0.2"/>
    <circle cx="184" cy="192" r="24" opacity="0.2"/>
    <circle cx="72" cy="128" r="24" opacity="0.2"/>
    <circle cx="184" cy="64" r="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <circle cx="184" cy="192" r="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <circle cx="72" cy="128" r="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <line x1="160.3" y1="78.3" x2="95.7" y2="113.7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <line x1="95.7" y1="142.3" x2="160.3" y2="177.7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
  </svg>
);