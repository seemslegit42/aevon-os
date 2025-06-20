// src/components/icons/HelpCircleIcon.tsx
// This is the same as InfoIcon, just for semantic difference if desired.
// For now, it will be identical to InfoIcon
import React from 'react';
import type { IconProps } from '../../types/icon';

export const HelpCircleIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 256 256"
    className={className}
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="128" cy="128" r="96" opacity="0.2"/>
    <circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="16"/>
    <circle cx="128" cy="80" r="12" fill="currentColor"/>
    <line x1="128" y1="120" x2="128" y2="176" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
  </svg>
);
