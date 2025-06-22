
import React from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const LoomNexusIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 1.7;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline Loom Nexus Icon */}
      {/* Central Crystal Core */}
      <path d="M12 8.5l-3-5 6 0-3 5Zm0 7l3 5-6 0 3-5Zm-5-3.5l-5-3 0 6 5-3Zm10 0l5-3 0 6-5-3Z"/>
      <path d="M12 8.5L9 3.5h6L12 8.5Z" opacity="0.7"/> {/* Top facet */}
      <path d="M12 15.5L9 20.5h6L12 15.5Z" opacity="0.7"/> {/* Bottom facet */}
      <path d="M7 12L2 9v6l5-3Z" opacity="0.6"/> {/* Left facet */}
      <path d="M17 12L22 9v6l-5-3Z" opacity="0.6"/> {/* Right facet */}
      <circle cx="12" cy="12" r="2.5" opacity="0.4"/>

      {/* Radiating Faceted Connections/Threads (Using stroke) */}
      {/* Diagonal Top-Left */}
      <path d="M9.5 9.5L5 5M8.25 8.25L6.5 6.5" fill="none" stroke="currentColor" strokeWidth={sw * 0.6} strokeLinecap="round" opacity="0.8"/>
      {/* Diagonal Top-Right */}
      <path d="M14.5 9.5L19 5M15.75 8.25L17.5 6.5" fill="none" stroke="currentColor" strokeWidth={sw * 0.6} strokeLinecap="round" opacity="0.8"/>
      {/* Diagonal Bottom-Left */}
      <path d="M9.5 14.5L5 19M8.25 15.75L6.5 17.5" fill="none" stroke="currentColor" strokeWidth={sw * 0.6} strokeLinecap="round" opacity="0.8"/>
      {/* Diagonal Bottom-Right */}
      <path d="M14.5 14.5L19 19M15.75 15.75L17.5 17.5" fill="none" stroke="currentColor" strokeWidth={sw * 0.6} strokeLinecap="round" opacity="0.8"/>
      
      {/* Straight Top/Bottom/Left/Right connections */}
      <path d="M12 8.5V3.5M12 15.5V20.5M8.5 12H3.5M15.5 12H20.5" fill="none" stroke="currentColor" strokeWidth={sw * 0.5} strokeLinecap="round" opacity="0.7"/>
      
      {/* Endpoint Crystals (small) */}
      <path d="M4.25 4.25l-1.5-1 3 0-1.5 1Z" opacity="0.5"/>
      <path d="M19.75 4.25l1.5-1-3 0 1.5 1Z" opacity="0.5"/>
      <path d="M4.25 19.75l-1.5 1 3 0-1.5-1Z" opacity="0.5"/>
      <path d="M19.75 19.75l1.5 1-3 0 1.5-1Z" opacity="0.5"/>
    </IconBase>
  );
};

export default LoomNexusIcon;
