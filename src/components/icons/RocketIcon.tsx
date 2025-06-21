
// src/components/icons/RocketIcon.tsx
import React from 'react';
import type { IconProps } from '../../types/icon';

export const RocketIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M224,115.5V88a8,8,0,0,0-8-8H162.2a48,48,0,0,0-92.4,0H17.6a8,8,0,0,0-8,8v27.5a87.9,87.9,0,0,0,32,64.9V224a8,8,0,0,0,16,0v-16h96v16a8,8,0,0,0,16,0v-43.6a87.9,87.9,0,0,0,32-64.9Z" opacity="0.2"/>
    <path d="M232,88v27.5a96,96,0,0,1-32.9,71.4,16,16,0,0,0-9.1,14.2V224a16,16,0,0,1-32,0V208H97.9v16a16,16,0,0,1-32,0V201.1a16,16,0,0,0-9.1-14.2A96,96,0,0,1,24,115.5V88A16,16,0,0,1,40,72H76a56,56,0,0,1,104,0h36A16,16,0,0,1,232,88Zm-16,0H188a40,40,0,0,0-76.4-16H40v27.5a80,80,0,0,0,176,0Z" fill="currentColor"/>
  </svg>
);
