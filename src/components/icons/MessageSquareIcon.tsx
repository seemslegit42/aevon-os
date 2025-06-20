// src/components/icons/MessageSquareIcon.tsx
import React from 'react';
import { IconProps } from '../../../config';

export const MessageSquareIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M216,48H40A16,16,0,0,0,24,64V224L64,192H216a16,16,0,0,0,16-16V64A16,16,0,0,0,216,48Z" opacity="0.2"/>
    <path d="M216,40H40A24.1,24.1,0,0,0,16,64V224a7.8,7.8,0,0,0,3.9,6.9A7.9,7.9,0,0,0,24,232a8.3,8.3,0,0,0,3.9-.9L64,210.2V192H40V64H216v96H192v24h24a24.1,24.1,0,0,0,24-24V64A24.1,24.1,0,0,0,216,40ZM59.4,203.8,40,215.3V192h19.4Z" fill="currentColor"/>
    <path d="M64,210.2A23.9,23.9,0,0,0,40,192V64H216v96a23.9,23.9,0,0,0-24-24H72Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
  </svg>
);