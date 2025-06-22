import React from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const ServerIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Main Server Rack Unit Body */}
      <path d="M20 3H4C3.45 3 3 3.45 3 4v16c0 .55.45 1 1 1h16c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1z"/>
      <path d="M20 3L12 2 4 3v1h16V3z" opacity="0.6"/> {/* Top Bevel */}
      
      {/* Slots/Sections */}
      <rect x="5" y="5" width="14" height="3" rx="0.5" opacity="0.8"/>
      <rect x="5" y="10" width="14" height="3" rx="0.5" opacity="0.8"/>
      <rect x="5" y="15" width="14" height="3" rx="0.5" opacity="0.8"/>
      
      {/* Indicators (Simplified) */}
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" opacity="0.5"/>
      <circle cx="17.5" cy="11.5" r="0.75" fill="currentColor" opacity="0.5"/>
      <circle cx="17.5" cy="16.5" r="0.75" fill="currentColor" opacity="0.5"/>
    </IconBase>
  );
};

export default ServerIcon;
