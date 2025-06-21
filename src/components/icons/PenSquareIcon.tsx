
// src/components/icons/PenSquareIcon.tsx
import React from 'react';
import type { IconProps } from '../../types/icon';

export const PenSquareIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M216,40H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H216a8,8,0,0,0,8-8V48A8,8,0,0,0,216,40Zm-29.9,35.9L98.6,163.4a7.9,7.9,0,0,1-5.6,2.3h-16a8,8,0,0,1-8-8v-16a7.9,7.9,0,0,1,2.3-5.6L158.8,50.6a8.1,8.1,0,0,1,11.4,0l16,16A8.1,8.1,0,0,1,186.1,75.9Z" opacity="0.2"/>
    <path d="M224,48V208a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32H208A16,16,0,0,1,224,48ZM92.7,176H72V155.3l80-80,20.7,20.7ZM172,59.3,162.7,48,152,58.7,99.3,111.3a8.1,8.1,0,0,0-2.3,5.7V136h19.1a7.9,7.9,0,0,0,5.6-2.3L196.7,60,185.3,48.7a16.1,16.1,0,0,0-22.6,0Z" fill="currentColor"/>
  </svg>
);
