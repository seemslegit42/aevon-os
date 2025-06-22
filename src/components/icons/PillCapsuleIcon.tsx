import React from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const PillCapsuleIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Crystalline Pill/Capsule Icon */}
      {/* Main capsule shape with a split for two halves */}
      <path d="M12 3.5C8.42 3.5 5.5 6.42 5.5 10v4c0 3.58 2.92 6.5 6.5 6.5s6.5-2.92 6.5-6.5v-4C18.5 6.42 15.58 3.5 12 3.5Z"/>
      
      {/* Highlight/Split Line */}
      <path d="M5.5 10h13" strokeWidth={strokeWidth ? strokeWidth * 0.5 : 1} strokeLinecap="round" stroke="currentColor" opacity="0.55"/>
      
      {/* Top Half Facets */}
      <path d="M12 3.5C8.42 3.5 5.5 6.42 5.5 10h6.5V3.5Z" opacity="0.75"/>
      <path d="M12 3.5c1.33 0 2.55.43 3.54 1.15L12 10V3.5Z" opacity="0.55"/>
      
      {/* Bottom Half Facets */}
      <path d="M12 20.5c3.58 0 6.5-2.92 6.5-6.5h-6.5v6.5Z" opacity="0.65"/>
      <path d="M12 20.5c-1.33 0-2.55-.43-3.54-1.15L12 14v6.5Z" opacity="0.45"/>

      {/* Subtle shine on ends */}
      <path d="M12 3.5a1.25 1.25 0 0 0-1.25 1.25h2.5A1.25 1.25 0 0 0 12 3.5Z" opacity="0.25"/>
      <path d="M12 20.5a1.25 1.25 0 0 1 1.25-1.25h-2.5A1.25 1.25 0 0 1 12 20.5Z" opacity="0.25"/>
    </IconBase>
  );
};

export default PillCapsuleIcon;