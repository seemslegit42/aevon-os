// src/components/icons/CreditCardIcon.tsx
import type React from 'react';
import type { IconProps } from '../../types/icon';

export const CreditCardIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className}
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="aevosIconGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{stopColor:"#20B2AA"}} />
        <stop offset="100%" style={{stopColor:"#3EB991"}} />
      </linearGradient>
    </defs>
    <rect x="32" y="48" width="192" height="160" rx="16" fill="none" stroke="url(#aevosIconGradient)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <line x1="32" y1="96" x2="224" y2="96" fill="none" stroke="url(#aevosIconGradient)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <line x1="80" y1="152" x2="120" y2="152" fill="none" stroke="url(#aevosIconGradient)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
  </svg>
);