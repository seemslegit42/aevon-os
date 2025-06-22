import React from 'react';
import IconBase, { ICON_GRADIENT_ID } from '../IconBase';
import { IconProps } from '../../types';

const LoomShuttleIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Crystalline Loom Shuttle Icon */}
      {/* Main shuttle body - elongated, faceted */}
      <path d="M21.5 10.5L12 4.5 2.5 10.5v3L12 19.5l9.5-6v-3Z"/>
      
      {/* Top surface facet */}
      <path d="M12 4.5L2.5 10.5h19L12 4.5Z" opacity="0.7"/>
      {/* Bottom surface facet */}
      <path d="M12 19.5L2.5 13.5h19L12 19.5Z" opacity="0.5"/>
      
      {/* Central groove or thread holder area */}
      <path d="M10.5 8.5h3L12 6.5l-1.5 2Z" opacity="0.4"/>
      <path d="M10.5 15.5h3L12 17.5l-1.5-2Z" opacity="0.4"/>
      <path d="M10.5 8.5v7h3v-7h-3Z" opacity="0.2"/>

      {/* "Thread" element - could be a thin line with gradient stroke */}
      <path d="M4.5 12h15" 
            fill="none" 
            stroke={`url(#${ICON_GRADIENT_ID})`} 
            strokeWidth={(strokeWidth || 2) * 0.4} 
            strokeLinecap="round"
            opacity="0.6"/>
      <circle cx="12" cy="12" r="1" opacity="0.8"/>
    </IconBase>
  );
};

export default LoomShuttleIcon;
