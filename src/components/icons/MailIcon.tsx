// src/components/icons/MailIcon.tsx
import React from 'react';
import { IconProps } from '../../../config';

export const MailIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 256 256"
    className={className}
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="256" height="256" fill="none"/>
    <path d="M224,56H32A16,16,0,0,0,16,72V184a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V72A16,16,0,0,0,224,56Z" opacity="0.2"/>
    <path d="M224,56H32A16,16,0,0,0,16,72V184a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V72A16,16,0,0,0,224,56Zm-14.5,16L128,131.2,46.5,72ZM32,184V77.8l89.7,59.8a15.9,15.9,0,0,0,9.6,3.4,16.2,16.2,0,0,0,9.7-3.4L224,77.8V184Z" fill="currentColor"/>
  </svg>
);