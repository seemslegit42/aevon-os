// src/components/icons/BrainCircuitIcon.tsx
import React from 'react';
import type { IconProps } from '../../types/icon';

export const BrainCircuitIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M208,88H152a8,8,0,0,1-8-8V24a8,8,0,0,0-16,0V80H120V24a8,8,0,0,0-16,0V80H96V24a8,8,0,0,0-16,0V80H48a8,8,0,0,0-8,8v56a8,8,0,0,0,8,8H80v56a8,8,0,0,0,16,0V160h8v56a8,8,0,0,0,16,0V160h8v56a8,8,0,0,0,16,0V160h56a8,8,0,0,0,8-8V88A8,8,0,0,0,208,88Zm-8,56H160V120h40Zm-56,0H96V120h48Zm-56,0H48V96H88Z" opacity="0.2"/>
    <path d="M216,80H152a16,16,0,0,1-16-16V24a16,16,0,0,0-32,0V64H120V24a16,16,0,0,0-32,0V64H72V24a16,16,0,0,0-32,0V80H32a16,16,0,0,0-16,16v56a16,16,0,0,0,16,16H72v40a16,16,0,0,0,32,0V168h16v40a16,16,0,0,0,32,0V168h16v40a16,16,0,0,0,32,0V168h40a16,16,0,0,0,16-16V88A16,16,0,0,0,216,80ZM144,152H80V96h64Zm56,0H152V96h48Z" fill="currentColor"/>
  </svg>
);
