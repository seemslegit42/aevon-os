// src/components/icons/AlertTriangleIcon.tsx
import React from 'react';
import type { IconProps } from '../../types/icon';

export const AlertTriangleIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M236.7,188l-80-138.6a23.9,23.9,0,0,0-41.4,0L35.3,188A24,24,0,0,0,56,224H200a24,24,0,0,0,20.7-36Z" opacity="0.2"/>
    <path d="M236.7,188l-80-138.6a23.9,23.9,0,0,0-41.4,0L35.3,188A24,24,0,0,0,56,224H200a24,24,0,0,0,20.7-36ZM120,136a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm8,40a12,12,0,1,1-12-12A12,12,0,0,1,128,176Z" fill="currentColor"/>
  </svg>
);
