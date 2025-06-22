
import React from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const LoomWeaveIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 1.8;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline Loom Weave Icon */}
      {/* Weaving Strands - using stroke for intricate pattern */}
      {/* Horizontal Strands */}
      <path d="M2 7h20 M2 12h20 M2 17h20" 
            fill="none" stroke="currentColor" strokeWidth={sw * 0.8} strokeLinecap="round" opacity="0.7"/>
      {/* Vertical Strands (Over/Under effect suggested by breaks and fills) */}
      {/* Strand 1 */}
      <path d="M5 2v3.5 M5 8.5v3 M5 13.5v3 M5 18.5v3.5" 
            fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round"/>
      <path d="M5 5.5L4.5 7l.5.5.5-.5-.5-.5Z M5 10.5L4.5 12l.5.5.5-.5-.5-.5Z M5 15.5L4.5 17l.5.5.5-.5-.5-.5Z" opacity="0.9"/>
      {/* Strand 2 */}
      <path d="M10 2v3.5 M10 8.5v3 M10 13.5v3 M10 18.5v3.5" 
            fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" opacity="0.8"/>
      <path d="M10 5.5L9.5 7l.5.5.5-.5-.5-.5Z M10 10.5L9.5 12l.5.5.5-.5-.5-.5Z M10 15.5L9.5 17l.5.5.5-.5-.5-.5Z" opacity="0.7"/>
      {/* Strand 3 */}
      <path d="M15 2v3.5 M15 8.5v3 M15 13.5v3 M15 18.5v3.5" 
            fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round"/>
      <path d="M15 5.5L14.5 7l.5.5.5-.5-.5-.5Z M15 10.5L14.5 12l.5.5.5-.5-.5-.5Z M15 15.5L14.5 17l.5.5.5-.5-.5-.5Z" opacity="0.9"/>
      {/* Strand 4 */}
       <path d="M19 2v3.5 M19 8.5v3 M19 13.5v3 M19 18.5v3.5" 
            fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" opacity="0.8"/>
      <path d="M19 5.5L18.5 7l.5.5.5-.5-.5-.5Z M19 10.5L18.5 12l.5.5.5-.5-.5-.5Z M19 15.5L18.5 17l.5.5.5-.5-.5-.5Z" opacity="0.7"/>
    </IconBase>
  );
};

export default LoomWeaveIcon;
