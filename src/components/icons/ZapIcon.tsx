// src/components/icons/ZapIcon.tsx
import React from 'react';
import { IconProps } from '../../../config';

export const ZapIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <polygon points="160 16 96 112 144 128 96 240 160 144 112 128 160 16" opacity="0.2"/>
    <polygon points="160 16 96 112 144 128 96 240 160 144 112 128 160 16" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
  </svg>
);