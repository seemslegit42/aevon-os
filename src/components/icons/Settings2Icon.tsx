// src/components/icons/Settings2Icon.tsx
import React from 'react';
import { IconProps } from '../../../config';

export const Settings2Icon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="24" y="104" width="208" height="48" rx="8" opacity="0.2"/>
    <path d="M128,176a28,28,0,1,0-28-28A28.1,28.1,0,0,0,128,176Zm0-40a12,12,0,1,1-12,12A12,12,0,0,1,128,136Z" opacity="0.2"/>
    <path d="M128,80a28,28,0,1,0-28-28A28.1,28.1,0,0,0,128,80Zm0-40A12,12,0,1,1,116,52,12,12,0,0,1,128,40Z" opacity="0.2"/>
    <rect x="24" y="104" width="208" height="48" rx="8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <path d="M100,176a28,28,0,1,1,28-28A28.1,28.1,0,0,1,100,176Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <path d="M100,80a28,28,0,1,1,28-28A28.1,28.1,0,0,1,100,80Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
  </svg>
);