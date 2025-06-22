// src/components/icons/ArmoryIcon.tsx
import type React from 'react';
import type { IconProps } from '../../types/icon';

export const ArmoryIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className}
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="aevosIconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6A0DAD" />
        <stop offset="50%" stopColor="#3EB991" />
        <stop offset="100%" stopColor="#20B2AA" />
      </linearGradient>
    </defs>
    <path d="M208,40H48A24.1,24.1,0,0,0,24,64V136c0,61.9,44.5,95.1,94.2,110.6a23.8,23.8,0,0,0,19.6,0c49.7-15.5,94.2-48.7,94.2-110.6V64A24.1,24.1,0,0,0,208,40Z" fill="url(#aevosIconGradient)"/>
    <polygon points="128,96 142.3,124.6 173.2,129.2 150.6,151.1 155.7,182 128,166.9 100.3,182 105.4,151.1 82.8,129.2 113.7,124.6" fill="#FFFFFF"/>
  </svg>
);
