// src/components/icons/RestoreIcon.tsx
import React from 'react';
import type { IconProps } from '../../types/icon';

export const RestoreIcon: React.FC<IconProps> = ({ className, size = 18, style }) => (
<svg
    width={size}
    height={size}
    viewBox="0 0 256 256"
    className={className}
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
>
    <path d="M216,40H88a8,8,0,0,0-8,8V80h40a8,8,0,0,1,8,8v40h40a8,8,0,0,1,8,8v40h32a8,8,0,0,0,8-8V48A8,8,0,0,0,216,40Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <rect x="40" y="88" width="128" height="128" rx="8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
</svg>
);