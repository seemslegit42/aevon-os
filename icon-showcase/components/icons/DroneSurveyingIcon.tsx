
import React from 'react';
import IconBase, { ICON_GRADIENT_ID } from '../IconBase';
import { IconProps } from '../../types';

const DroneSurveyingIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 1.7;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline Drone Surveying Icon */}
      {/* Drone Body (Central) */}
      <path d="M12 4.5l-5 2.5v3l5 2.5 5-2.5v-3l-5-2.5Z"/>
      <path d="M12 4.5L7 7h10L12 4.5Z" opacity="0.7"/> {/* Top facet */}
      <path d="M7 9.5v-2.5l5 2.5v2.5l-5-2.5Z" opacity="0.5"/> {/* Left facet */}
      <path d="M17 9.5v-2.5l-5 2.5v2.5l5-2.5Z" opacity="0.5"/> {/* Right facet */}

      {/* Propeller Arms & Rotors (Simplified) */}
      {/* Top-Left */}
      <path d="M7 7L3.5 4.5M5.5 5.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" fill="currentColor" opacity="0.8"/>
      <path d="M7 7L3.5 4.5l.5-1L7 6V7Z" opacity="0.4"/>
      {/* Top-Right */}
      <path d="M17 7L20.5 4.5M18.5 5.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Z" fill="currentColor" opacity="0.8"/>
      <path d="M17 7L20.5 4.5l-.5-1L17 6V7Z" opacity="0.4"/>
      {/* Bottom-Left */}
      <path d="M7 10L3.5 12.5M5.5 11.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" fill="currentColor" opacity="0.8"/>
      <path d="M7 10L3.5 12.5l.5 1L7 11V10Z" opacity="0.4"/>
      {/* Bottom-Right */}
      <path d="M17 10L20.5 12.5M18.5 11.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Z" fill="currentColor" opacity="0.8"/>
      <path d="M17 10L20.5 12.5l-.5 1L17 11V10Z" opacity="0.4"/>

      {/* Camera Lens */}
      <circle cx="12" cy="11.5" r="1.75" opacity="0.9"/>
      <path d="M12 9.75A1.75 1.75 0 0 0 10.25 11.5H12V9.75Z" opacity="0.5"/>

      {/* Abstract Terrain Lines Below */}
      <path d="M3 17.5s3-1.5 6-1.5 6 1.5 6 1.5M4.5 20s3-1 4.5-1 4.5 1 4.5 1" 
            fill="none" stroke={`url(#${ICON_GRADIENT_ID})`} strokeWidth={sw * 0.6} strokeLinecap="round" opacity="0.6"/>
    </IconBase>
  );
};

export default DroneSurveyingIcon;
