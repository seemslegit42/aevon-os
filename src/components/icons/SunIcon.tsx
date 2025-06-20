// src/components/icons/SunIcon.tsx
import React from 'react';
import type { IconProps } from '../../types/icon';

export const SunIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 256 256"
    className={className}
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="128" cy="128" r="60" opacity="0.2"/>
    <path d="M128,48V16M63,63,49,49m-33,79H48m14,65L49,207M128,208V240m65-14L207,207m33-79H208M193,63l14-14" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <circle cx="128" cy="128" r="60" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
  </svg>
);
