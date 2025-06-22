import React from 'react';
import IconBase, { ICON_GRADIENT_ID } from '../IconBase';
import { IconProps } from '../../types';

const StethoscopeIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const effectiveStrokeWidth = strokeWidth || 1.8;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={effectiveStrokeWidth} viewBox="0 0 24 24">
      {/* Crystalline Stethoscope Icon */}
      {/* Chest Piece (Bell/Diaphragm) */}
      <circle cx="7.5" cy="17.5" r="3.25" />
      <path d="M7.5 14.25A3.25 3.25 0 0 0 4.25 17.5H7.5v-3.25Z" opacity="0.65"/>
      <path d="M7.5 17.5a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5Z" opacity="0.45"/>
      <path d="M7.5 15c-.9 0-1.65.75-1.65 1.65v.7h3.3v-.7c0-.9-.75-1.65-1.65-1.65Z" opacity="0.25"/>

      {/* Tubing - uses stroke with gradient */}
      <path d="M7.5 14.25C7.5 8.5 10.5 4.5 15.5 4.5S19.5 6.5 19.5 9" 
            fill="none" 
            stroke={`url(#${ICON_GRADIENT_ID})`} 
            strokeWidth={effectiveStrokeWidth * 1.1} 
            strokeLinecap="round"/>
      <path d="M7.5 14.25c.4-2.8 1.8-5.5 4.8-7.2M15.5 4.5c1.2.4 2.3 1.5 2.8 3" 
            fill="none" 
            stroke={`url(#${ICON_GRADIENT_ID})`} 
            strokeWidth={effectiveStrokeWidth * 0.7} 
            strokeLinecap="round" opacity="0.55"/>
      
      {/* Earpieces (Binaurals) - filled */}
      <path d="M15.5 4.5a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0Z" />
      <path d="M15.5 3L14.75 4l.75.75.75-.75-.75-.75Z" opacity="0.65"/>
      <path d="M19.5 9a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0Z" />
      <path d="M19.5 7.5L18.75 8.5l.75.75.75-.75-.75-.75Z" opacity="0.65"/>
    </IconBase>
  );
};

export default StethoscopeIcon;