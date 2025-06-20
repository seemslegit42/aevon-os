// src/components/icons/MiniDotIcon.tsx
import React from 'react';
import type { IconProps } from '../../types/icon';

export const MiniDotIcon: React.FC<IconProps> = ({ className, size = 8, style }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 256 256" 
        className={className} 
        fill="currentColor" // This will be the fill color
        style={style}
        xmlns="http://www.w3.org/2000/svg"
    >
        <circle cx="128" cy="128" r="96"/>
    </svg>
);
