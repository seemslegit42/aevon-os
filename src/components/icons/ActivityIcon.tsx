import React from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const ActivityIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 2;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Main Pulse Line */}
      <path d="M2 12.5h3.5l2-5.5 4 9 3-6 2.5 4H22" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth={sw * 1.05} 
            strokeLinecap="round" 
            strokeLinejoin="round"/>
      {/* Facet under the line for 3D body */}
      <path d="M2 12.8h3l2-5.5.5.5 3.5 9 .5-.5 2.5-6 .5.5 2 4h4" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth={sw * 0.6} 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            opacity="0.5"/>
      
      {/* Nodes at Peaks/Troughs (Simplified) */}
      <circle cx="5.5" cy="12.5" r="1" opacity="0.7"/>
      <circle cx="7.5" cy="7" r="1" opacity="0.7"/>
      <circle cx="11.5" cy="16" r="1" opacity="0.7"/>
      <circle cx="14.5" cy="10" r="1" opacity="0.7"/>
      <circle cx="17" cy="14" r="1" opacity="0.7"/>
      <circle cx="20.5" cy="12.5" r="1" opacity="0.7"/>
    </IconBase>
  );
};

export default ActivityIcon;
