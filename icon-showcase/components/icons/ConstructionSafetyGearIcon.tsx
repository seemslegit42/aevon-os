
import React from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const ConstructionSafetyGearIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 1.8;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline Construction Safety Gear Icon (Hard Hat + Goggles) */}
      {/* Hard Hat Dome */}
      <path d="M12 3C7.58 3 4 5.79 4 9.5c0 1.5.47 2.87 1.25 4H4.5v3.5h15V13.5h-.75c.78-1.13 1.25-2.5 1.25-4C19.92 5.79 16.42 3 12 3Z"/>
      <path d="M12 3L10 5h4L12 3Z" opacity="0.7"/> {/* Top ridge */}
      <path d="M12 3c-2.5 0-4.6.9-6 2.37L12 9.5l6-4.13C16.6 3.9 14.5 3 12 3Z" opacity="0.5"/>
      
      {/* Goggles Frame */}
      <path d="M19.5 11.5H4.5c-.83 0-1.5.67-1.5 1.5v3c0 .83.67 1.5 1.5 1.5h15c.83 0 1.5-.67 1.5-1.5v-3c0-.83-.67-1.5-1.5-1.5Z" opacity="0.9"/>
      <path d="M4.5 11.5L12 10l7.5 1.5v3L12 16l-7.5-1.5v-3Z" opacity="0.4"/> {/* Goggle curvature */}

      {/* Goggle Lenses (Faceted) */}
      {/* Left Lens */}
      <path d="M8.5 12.5h-3v2h3v-2Z M8.5 12.5L7 12l-1.5.5v2L7 15l1.5-.5v-2Z" opacity="0.7"/>
      {/* Right Lens */}
      <path d="M18.5 12.5h-3v2h3v-2Z M18.5 12.5L17 12l-1.5.5v2L17 15l1.5-.5v-2Z" opacity="0.7"/>
      
      {/* Strap (subtle, under hat brim) */}
      <path d="M4.5 13.5H3M19.5 13.5H21" stroke="currentColor" strokeWidth={sw*0.4} strokeLinecap="round" opacity="0.3"/>
    </IconBase>
  );
};

export default ConstructionSafetyGearIcon;
