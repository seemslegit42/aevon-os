// src/components/icons/BookOpenIcon.tsx
import React from 'react';
import type { IconProps } from '../../types/icon';

export const BookOpenIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 256 256"
    className={className}
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M240,40H100a3.9,3.9,0,0,0-4,4V208a12,12,0,0,0,24,0V56h16V208a12,12,0,0,0,24,0V56h64a12,12,0,0,0,12-12V52A12,12,0,0,0,240,40Z" opacity="0.2"/>
    <path d="M224,32H100A12,12,0,0,0,88,44V208a20.1,20.1,0,0,0,20,20,19.7,19.7,0,0,0,12.5-4.5,19.7,19.7,0,0,0,12.5,4.5,20.1,20.1,0,0,0,20-20V56h4V208a20.1,20.1,0,0,0,20,20,19.7,19.7,0,0,0,12.5-4.5A19.7,19.7,0,0,0,204,228a20.1,20.1,0,0,0,20-20V52A20.1,20.1,0,0,0,204,32H156V208a12,12,0,0,1-24,0V56h-4V208a12,12,0,0,1-24,0V44A12,12,0,0,0,100,32Z" fill="currentColor"/>
  </svg>
);
