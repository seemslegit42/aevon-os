
// src/components/icons/HardDriveIcon.tsx
import React from 'react';
import type { IconProps } from '../../types/icon';

export const HardDriveIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 256 256"
    className={className}
    fill="currentColor" 
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M224,88H32A16,16,0,0,0,16,104v48a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V104A16,16,0,0,0,224,88Zm-8,56H40V104H216v40Z" opacity="0.2"/>
    <path d="M224,80H32A24.1,24.1,0,0,0,8,104v48A24.1,24.1,0,0,0,32,176H224a24.1,24.1,0,0,0,24-24V104A24.1,24.1,0,0,0,224,80Zm8,72a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V104a8,8,0,0,1,8-8H224a8,8,0,0,1,8,8Z" fill="currentColor"/>
    <circle cx="188" cy="128" r="12" fill="currentColor"/>
  </svg>
);
