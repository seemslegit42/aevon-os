// src/components/icons/EyeIcon.tsx
import React from 'react';
import type { IconProps } from '../../types/icon';

export const EyeIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M247.3,124.8c-.4-.8-1.1-1.4-1.1-1.4C224.7,92.6,190.2,72,128,72S31.3,92.6,9.8,123.4c0,0-.7.6-1.1,1.4a8,8,0,0,0,0,6.4c.4.8,1.1,1.4,1.1,1.4C31.3,163.4,65.8,184,128,184s96.7-20.6,118.2-51.4c0,0,.7-.6,1.1-1.4A8,8,0,0,0,247.3,124.8Z" opacity="0.2"/>
    <path d="M128,72c-67.4,0-107.2,34.3-122.2,52.2a15.7,15.7,0,0,0,0,19.6C30.8,162.7,72.6,184,128,184s97.2-21.3,122.2-50.2a15.7,15.7,0,0,0,0-19.6C225.2,106.3,183.4,72,128,72Zm0,96a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <circle cx="128" cy="128" r="40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
  </svg>
);
