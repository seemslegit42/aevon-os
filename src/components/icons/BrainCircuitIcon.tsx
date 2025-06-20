// src/components/icons/BrainCircuitIcon.tsx
import React from 'react';
import type { IconProps } from '../../types/icon';

export const BrainCircuitIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M128,24A104,104,0,0,0,56,210.5V224a8,8,0,0,0,8,8h48a8,8,0,0,0,8-8V188h16v36a8,8,0,0,0,8,8h48a8,8,0,0,0,8-8V210.5A104,104,0,0,0,128,24Zm0,16a88.1,88.1,0,0,1,88,88c0,30.3-17.4,57.1-43.1,73.5a8,8,0,0,0-4.9,7.3V216H144V180a8,8,0,0,0-16,0v36H104V208.8a8,8,0,0,0-4.9-7.3C71.4,185.1,54,158.3,54,128A88.1,88.1,0,0,1,128,40Z" opacity="0.2"/>
    <path d="M128,32A96,96,0,0,0,32,128c0,34.6,19.4,65.2,48.1,81.1a15.9,15.9,0,0,0,9.9,2.9H112V188a8,8,0,0,1,8-8h16a8,8,0,0,1,8,8v24h24a15.9,15.9,0,0,0,9.9-2.9C206.6,193.2,224,162.6,224,128A96,96,0,0,0,128,32Zm0,160H112V176a8,8,0,0,0-8-8H88a8,8,0,0,0-8,8v16H67.2c-22.5-14.1-35.2-39.4-35.2-68,0-48.5,39.5-88,88-88s88,39.5,88,88c0,28.6-12.7,53.9-35.2,68H160V176a8,8,0,0,0-8-8h-16a8,8,0,0,0-8,8Z" fill="currentColor"/>
    <circle cx="128" cy="128" r="16" fill="currentColor"/>
    <circle cx="88" cy="104" r="12" fill="currentColor"/>
    <circle cx="168" cy="104" r="12" fill="currentColor"/>
    <circle cx="88" cy="152" r="12" fill="currentColor"/>
    <circle cx="168" cy="152" r="12" fill="currentColor"/>
  </svg>
);
