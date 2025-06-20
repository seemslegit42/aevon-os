// src/components/icons/UserPlusIcon.tsx
import React from 'react';
import type { IconProps } from '../../types/icon';

export const UserPlusIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M256,128a8,8,0,0,1-8,8H136v40a8,8,0,0,1-16,0V136H80a8,8,0,0,1,0-16h40V80a8,8,0,0,1,16,0v40h40A8,8,0,0,1,256,128Z" opacity="0.2"/>
    <path d="M128,24A104,104,0,1,0,232,128,104.2,104.2,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm40-80H136V104a8,8,0,0,0-16,0v32H88a8,8,0,0,0,0,16h32v32a8,8,0,0,0,16,0V144h32a8,8,0,0,0,0-16Z" fill="currentColor"/>
    <circle cx="128" cy="128" r="40" fill="none" opacity="0.2"/> {/* Example of combining for user part if needed */}
     <path d="M30.989,215.99062a112.03731,112.03731,0,0,1,194.02311.002" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" opacity="0.2"/>
  </svg>
);
// This is a simplified combination. A proper UserPlus would usually have a user silhouette and a plus.
// For now, this is a distinct plus in a circle.
// If you need a more traditional one:
// <path d="M234.7,189A103.6,103.6,0,0,0,144,136.6V100a8,8,0,0,0-16,0v36.6A103.6,103.6,0,0,0,41.3,189a8,8,0,0,0,10.2,10.2A136.8,136.8,0,0,1,128,155.1a136.8,136.8,0,0,1,76.5,44.1A8,8,0,0,0,212,208a8.5,8.5,0,0,0,7.5-5.1A8,8,0,0,0,234.7,189ZM128,120a40,40,0,1,0-40-40A40,40,0,0,0,128,120Z" opacity="0.2"/>
// <path d="M240,128a8,8,0,0,1-8,8H200v32a8,8,0,0,1-16,0V136H152a8,8,0,0,1,0-16h32V88a8,8,0,0,1,16,0v32h32A8,8,0,0,1,240,128ZM128,128a48,48,0,1,0-48-48A48,48,0,0,0,128,128Zm0-80a32,32,0,1,1-32,32A32.1,32.1,0,0,1,128,48Zm0,112c-42.5,0-72.2,22.2-83.9,40.2a16,16,0,0,0,13.8,23.8H198.1a16,16,0,0,0,13.8-23.8C200.2,194.2,170.5,176,128,176Z" fill="currentColor"/>
