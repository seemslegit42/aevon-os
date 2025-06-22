
import React from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const LoomDataFlowIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 1.8;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline Loom Data Flow Icon */}
      {/* Stream 1 (Left to Right, Top) */}
      <path d="M3 7s3-2 6-2 6 2 9 0M17 6.5l1-1.5-1-1.5" 
            fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 7.5s3-2 6-2 6 2 9 0M17 7l1-1.5-1-1.5" 
            fill="none" stroke="currentColor" strokeWidth={sw*0.5} strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>

      {/* Stream 2 (Right to Left, Middle, intertwining) */}
      <path d="M21 12s-3 2-6 2-4-1-6-1-4-1-6 0M7 12.5l-1 1.5 1 1.5" 
            fill="none" stroke="currentColor" strokeWidth={sw*0.9} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 12.5s-3 2-6 2-4-1-6-1-4-1-6 0M7 13l-1 1.5 1 1.5" 
            fill="none" stroke="currentColor" strokeWidth={sw*0.45} strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
      
      {/* Stream 3 (Left to Right, Bottom, intertwining) */}
      <path d="M3 17s3 2 6 2 4-1 6-1 4 1 6 0M17 16.5l1-1.5-1-1.5" 
            fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 17.5s3 2 6 2 4-1 6-1 4 1 6 0M17 17l1-1.5-1-1.5" 
            fill="none" stroke="currentColor" strokeWidth={sw*0.5} strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>

      {/* Crystalline "data packet" highlights on streams */}
      <path d="M8 6.5l-1-1 2 0-1 1Z M12 11.5l-1-1 2 0-1 1Z M16 16.5l-1-1 2 0-1 1Z" opacity="0.7" fill="currentColor"/>
    </IconBase>
  );
};

export default LoomDataFlowIcon;
