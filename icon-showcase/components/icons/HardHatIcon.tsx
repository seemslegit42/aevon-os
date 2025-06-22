
import React from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const HardHatIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Crystalline Hard Hat Icon */}
      {/* Main Dome */}
      <path d="M12 2.5C6.75 2.5 2.5 5.86 2.5 10.1c0 1.95.73 3.7 1.95 5.05H4c0 1 .8 1.85 1.75 1.85h12.5c.95 0 1.75-.85 1.75-1.85h.45c1.08-1.41 1.8-3.15 1.8-5.05C21.5 5.86 17.25 2.5 12 2.5Z"/>
      
      {/* Top Facet / Ridge */}
      <path d="M12 2.5L9.75 5h4.5L12 2.5Z" opacity="0.85"/>
      
      {/* Brim */}
      <path d="M21.25 15.15H2.75c-.41 0-.75-.34-.75-.75V13c0-.41.34-.75.75-.75h18.5c.41 0 .75.34.75.75v1.4c0 .41-.34.75-.75.75Z" opacity="0.9"/>
      <path d="M2.75 12.25L12 11l9.25 1.25v1.4L12 15.55l-9.25-1.9V12.25Z" opacity="0.65"/>
      
      {/* Dome Shadow/Highlight */}
      <path d="M12 2.5C8.5 2.5 5.25 4.75 4.45 8h15.1C18.75 4.75 15.5 2.5 12 2.5Z" opacity="0.45"/>
    </IconBase>
  );
};

export default HardHatIcon;
