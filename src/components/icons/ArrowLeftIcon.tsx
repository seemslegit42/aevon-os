// src/components/icons/ArrowLeftIcon.tsx
import React from 'react';
import { IconProps } from '../../../config';

export const ArrowLeftIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 256 256"
    className={className}
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <polyline points="160 208 80 128 160 48" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
  </svg>
);