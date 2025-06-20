// src/components/icons/ListChecksIcon.tsx
import React from 'react';
import type { IconProps } from '../../types/icon';

export const ListChecksIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M100,128V40H48A8,8,0,0,0,40,48v88a8,8,0,0,0,8,8Z" opacity="0.2"/>
    <path d="M208,128V40H156a8,8,0,0,0-8,8v88a8,8,0,0,0,8,8Z" opacity="0.2"/>
    <line x1="100" y1="184" x2="208" y2="184" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <line x1="100" y1="216" x2="208" y2="216" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <rect x="40" y="40" width="60" height="104" rx="8" strokeWidth="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <rect x="148" y="40" width="60" height="104" rx="8" strokeWidth="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <polyline points="48 184 64 200 92 172" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <polyline points="48 216 64 232 92 204" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
  </svg>
);
