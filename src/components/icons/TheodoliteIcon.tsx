import React from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const TheodoliteIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 1.8;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline Theodolite Icon */}
      {/* Tripod Legs (Simplified) */}
      <path d="M12 10.5L7 21M12 10.5L17 21M9.5 21h5" stroke="currentColor" strokeWidth={sw*0.5} strokeLinecap="round" opacity="0.5"/>
      <path d="M12 10.5L7 21l1-1 4-9.5 4 9.5 1 1-5-10.5Z" opacity="0.3" fill="currentColor"/>

      {/* Main Body/Mount */}
      <path d="M10 9h4v3h-4V9Z M10 9L12 7.5l2 1.5v3L12 13.5l-2-1.5V9Z" opacity="0.9"/>
      <path d="M12 7.5L10 9h4L12 7.5Z" opacity="0.6"/>

      {/* Telescope/Optical Unit */}
      <path d="M8.5 6.5h7v2h-7v-2Z M8.5 6.5L12 5l3.5 1.5v2L12 10l-3.5-1.5v-2Z"/>
      <path d="M12 5L8.5 6.5h7L12 5Z" opacity="0.7"/> {/* Top facet */}
      <path d="M14.5 7.5h1v1h-1z" opacity="0.4"/> {/* Lens end */}

      {/* Levelling Knobs (subtle) */}
      <circle cx="10.5" cy="12.5" r="0.75" opacity="0.6"/>
      <circle cx="13.5" cy="12.5" r="0.75" opacity="0.6"/>
    </IconBase>
  );
};

export default TheodoliteIcon;
