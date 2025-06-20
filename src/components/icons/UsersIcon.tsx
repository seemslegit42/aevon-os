// src/components/icons/UsersIcon.tsx
import React from 'react';
import type { IconProps } from '../../types/icon';

export const UsersIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 256 256"
    className={className}
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="88" cy="108" r="52" opacity="0.2"/>
    <circle cx="168" cy="108" r="52" opacity="0.2"/>
    <circle cx="88" cy="108" r="52" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <path d="M155.4,57.9A52,52,0,0,1,168,160h0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <path d="M32,216S36,172,88,172" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <path d="M224,216s-4-44-56-44-44.3,20.8-52.3,32.2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <path d="M116.3,164.2A52,52,0,0,1,168,56" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
  </svg>
);
