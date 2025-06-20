// src/components/icons/LayoutTemplateIcon.tsx
import React from 'react';
import { IconProps } from '../../../config';

export const LayoutTemplateIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M216,40H40A16,16,0,0,0,24,56V112a8,8,0,0,0,8,8H224a8,8,0,0,0,8-8V56A16,16,0,0,0,216,40Z" opacity="0.2"/>
    <path d="M24,144a8,8,0,0,0,8,8H136a8,8,0,0,0,8-8V136a8,8,0,0,1,8-8h72a8,8,0,0,1,8,8v64a16,16,0,0,1-16,16H152a8,8,0,0,1-8-8V200a8,8,0,0,0-8-8H40a16,16,0,0,1-16-16Z" opacity="0.2"/>
    <rect x="24" y="40" width="208" height="80" rx="16" strokeWidth="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <rect x="24" y="136" width="208" height="80" rx="16" strokeWidth="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);