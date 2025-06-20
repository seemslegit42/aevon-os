// src/components/icons/EditIcon.tsx
import React from 'react';
import { IconProps } from '../../../config';

export const EditIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M227.3,73.4,182.6,28.7a16,16,0,0,0-22.6,0L36.7,152A15.9,15.9,0,0,0,32,163.3V208a16,16,0,0,0,16,16H92.7A15.9,15.9,0,0,0,104,219.3L227.3,96a16,16,0,0,0,0-22.6ZM92.7,208H48V163.3L152,59.3l44.7,44.7Z" opacity="0.2"/>
    <path d="M92.7,216H48a8,8,0,0,1-8-8V163.3a7.9,7.9,0,0,1,2.3-5.6l128-128a8,8,0,0,1,11.4,0l44.6,44.6a8,8,0,0,1,0,11.4l-128,128A7.9,7.9,0,0,1,92.7,216ZM160,51.3,178.7,32,200,53.3,181.3,72Zm-80,80L48,163.3V200H84.7L176,108.7,147.3,80Z" fill="currentColor"/>
  </svg>
);
