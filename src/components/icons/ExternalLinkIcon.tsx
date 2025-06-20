// src/components/icons/ExternalLinkIcon.tsx
import React from 'react';
import { IconProps } from '../../../config';

export const ExternalLinkIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M192,104v96a16,16,0,0,1-16,16H64a16,16,0,0,1-16-16V88A16,16,0,0,1,64,72h96" opacity="0.2"/>
    <path d="M200,32V104a8,8,0,0,1-16,0V59.3L100.7,142.6a8.2,8.2,0,0,1-11.4,0,8.1,8.1,0,0,1,0-11.4L172.7,48H128a8,8,0,0,1,0-16Z" fill="currentColor"/>
    <path d="M192,112v88a8,8,0,0,1-8,8H64a8,8,0,0,1-8-8V88a8,8,0,0,1,8-8h88" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
  </svg>
);
