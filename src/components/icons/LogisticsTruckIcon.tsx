import React from 'react';
import IconBase, { ICON_GRADIENT_ID } from '../IconBase';
import { IconProps } from '../../types';

const LogisticsTruckIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 1.7;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline Logistics Truck Icon */}
      {/* Truck Cabin */}
      <path d="M3 10h5v6H3v-6Zm0 0L5.5 8.5 8 10v6L5.5 17.5 3 16v-6Z"/>
      <path d="M5.5 8.5L3 10h5V8.5Z" opacity="0.7"/> {/* Cabin Top */}
      <path d="M3 11.5h1.5v3H3z" opacity="0.4"/> {/* Window */}
      
      {/* Trailer/Cargo Area */}
      <path d="M8.5 7h11.5v11H8.5V7Zm0 0L14.25 5l5.75 2v11l-5.75 2-5.75-2V7Z"/>
      <path d="M14.25 5L8.5 7h11.5L14.25 5Z" opacity="0.6"/> {/* Trailer Top */}
      <path d="M8.5 18h11.5V9H8.5v9Z" opacity="0.1"/> {/* Trailer Side Shading */}

      {/* Wheels */}
      <circle cx="6" cy="18.5" r="1.75" opacity="0.9"/>
      <circle cx="16" cy="18.5" r="1.75" opacity="0.9"/>
      <path d="M6 16.75a1.75 1.75 0 0 0-1.24 2.99L6 20.25l1.24-1.24a1.75 1.75 0 0 0-1.24-2.26Z" opacity="0.5"/>

      {/* Location/GPS Marker (subtle, on trailer) */}
      <path d="M17.5 10a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm0 .75a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5Z" fill="currentColor" opacity="0.3"/>
      <path d="M17.5 9L16.5 10v.5h2V10l-1-1Z" opacity="0.2"/>
    </IconBase>
  );
};

export default LogisticsTruckIcon;
