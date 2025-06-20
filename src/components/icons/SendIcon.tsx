// src/components/icons/SendIcon.tsx
import React from 'react';
import type { IconProps } from '../../types/icon';

export const SendIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M228.4,28.2a15.6,15.6,0,0,0-15.8-3.3L30.9,91.8c-14,5.4-12.7,24.7,1.8,28.2l84.3,20.3,20.3,84.3c3.5,14.5,22.8,15.8,28.2,1.8l66.9-181.7A15.6,15.6,0,0,0,228.4,28.2ZM149,212.7l-15.3-64L198,84.4,149,212.7Z" opacity="0.2"/>
    <path d="M232.9,22.4A23.9,23.9,0,0,0,210,16.2L28.3,83.1a24.1,24.1,0,0,0,2.1,44.7l86.6,20.9L137.9,236a23.9,23.9,0,0,0,44.7,2.1L249.5,56A23.9,23.9,0,0,0,232.9,22.4ZM152.6,218.2,137.3,154,202,89.3Z" fill="currentColor"/>
  </svg>
);
