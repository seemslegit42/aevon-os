// src/components/icons/BugPlayIcon.tsx
import React from 'react';
import { IconProps } from '../../../config';

export const BugPlayIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M168,136H88V96h56a32,32,0,0,1,0,64H128" opacity="0.2"/>
    <line x1="128" y1="176" x2="128" y2="224" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <line x1="96" y1="224" x2="160" y2="224" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <line x1="104" y1="136" x2="104" y2="96" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <path d="M168,160h24a8,8,0,0,0,8-8V72a8,8,0,0,0-8-8H64a8,8,0,0,0-8,8v80a8,8,0,0,0,8,8H88" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <path d="M168,136H88V96h56a32,32,0,0,1,0,64H128" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <polygon points="176 32 240 72 176 112 176 32" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
  </svg>
);