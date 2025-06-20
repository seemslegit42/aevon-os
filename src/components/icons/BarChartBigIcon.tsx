// src/components/icons/BarChartBigIcon.tsx
import React from 'react';
import type { IconProps } from '../../types/icon';

export const BarChartBigIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="40" y="104" width="40" height="96" rx="8" opacity="0.2"/>
    <rect x="104" y="136" width="48" height="64" rx="8" opacity="0.2"/>
    <rect x="176" y="64" width="40" height="136" rx="8" opacity="0.2"/>
    <line x1="24" y1="200" x2="232" y2="200" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <rect x="40" y="104" width="40" height="96" rx="8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <rect x="104" y="136" width="48" height="64" rx="8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <rect x="176" y="64" width="40" height="136" rx="8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
  </svg>
);
