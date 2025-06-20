// src/components/icons/DatabaseZapIcon.tsx
import React from 'react';
import { IconProps } from '../../../config';

export const DatabaseZapIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <ellipse cx="128" cy="64" rx="88" ry="40" opacity="0.2"/>
    <path d="M40,116.3V64A87.8,87.8,0,0,1,128,24a87.8,87.8,0,0,1,88,40v52.3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <path d="M216,139.7V192c0,22.1-39.4,40-88,40s-88-17.9-88-40V80" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <path d="M40,144c0,22.1,39.4,40,88,40a103,103,0,0,0,49.2-12.3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <polygon points="208 96 176 144 200 152 184 184 232 128 200 120 208 96" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
  </svg>
);