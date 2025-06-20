// src/components/icons/LightningIcon.tsx
import React from 'react';
import type { IconProps } from '../../types/icon';

export const LightningIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M223.6,101.2,143,26.2a8.1,8.1,0,0,0-7-3.8,8,8,0,0,0-7.2,4.4L91.2,101.6,41.4,116a8,8,0,0,0-5.6,12.7l46.2,65.7L67.2,230a8,8,0,0,0,9.9,10.5l68.3-27.1,52.1,47.9a7.9,7.9,0,0,0,7.2,1.3,8,8,0,0,0,4.8-8.7l-16-72.2,50.7-33.4A8,8,0,0,0,223.6,101.2Zm-83.3,16.2a8,8,0,0,0-1.6,8.2l12.4,55.7-36.8-27a7.9,7.9,0,0,0-7.2-.1l-48.4,19.2,27.9-39.7a8.1,8.1,0,0,0-1-8.7L50.8,128l36.1-10.4a8,8,0,0,0,6.2-5.4L114.3,44l61.2,57.9-42.3,16.7A8.1,8.1,0,0,0,128.9,123Z"/>
  </svg>
);
