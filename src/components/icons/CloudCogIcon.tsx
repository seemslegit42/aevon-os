// src/components/icons/CloudCogIcon.tsx
import React from 'react';
import type { IconProps } from '../../types/icon';

export const CloudCogIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M168,88a48,48,0,0,0-45.7,32H120a48.1,48.1,0,0,0-48,48,47.4,47.4,0,0,0,9.3,28.7" opacity="0.2"/>
    <circle cx="188" cy="180" r="20" opacity="0.2"/>
    <path d="M96,128a56,56,0,0,1,53.2-55.5A80,80,0,0,1,224,96h0a80,80,0,0,1,0,160H72a56,56,0,0,1,0-112,56.7,56.7,0,0,1,24,5.1" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <circle cx="188" cy="180" r="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <line x1="188" y1="156" x2="188" y2="160" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <line x1="188" y1="200" x2="188" y2="204" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <line x1="202.1" y1="165.9" x2="199.3" y2="168.7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <line x1="176.7" y1="191.3" x2="173.9" y2="194.1" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <line x1="208" y1="180" x2="204" y2="180" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <line x1="172" y1="180" x2="168" y2="180" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <line x1="202.1" y1="194.1" x2="199.3" y2="191.3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    <line x1="176.7" y1="168.7" x2="173.9" y2="165.9" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
  </svg>
);
