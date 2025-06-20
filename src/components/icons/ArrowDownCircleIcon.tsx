// src/components/icons/ArrowDownCircleIcon.tsx
import React from 'react';
import { IconProps } from '../../../config';

export const ArrowDownCircleIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 256 256"
    className={className}
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="16"/>
    <polyline points="128 88 128 168" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <polyline points="160 136 128 168 96 136" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
  </svg>
);