
// src/components/icons/MicIcon.tsx
import React from 'react';
import type { IconProps } from '../../types/icon';

export const MicIcon: React.FC<IconProps> = ({ className, size = 24, style }) => (
 <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M128,176a48.1,48.1,0,0,0,48-48V64a48,48,0,0,0-96,0v64A48.1,48.1,0,0,0,128,176Z" opacity="0.2"/>
    <path d="M208,128v-8a80,80,0,0,0-160,0v8a8,8,0,0,0,16,0v-8a64,64,0,0,1,128,0v8a8,8,0,0,0,16,0ZM128,192a56,56,0,0,1-56-56V64a56,56,0,0,1,112,0v72A56,56,0,0,1,128,192Zm0-144a40,40,0,0,0-40,40v72a40,40,0,0,0,80,0V64A40,40,0,0,0,128,48Z" fill="currentColor"/>
    <line x1="128" y1="192" x2="128" y2="232" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <line x1="88" y1="232" x2="168" y2="232" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
  </svg>
);
