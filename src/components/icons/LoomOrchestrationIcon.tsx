
import React from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const LoomOrchestrationIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 1.7;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline Loom Orchestration Icon */}
      {/* Loom Shuttle/Node 1 (Top) */}
      <path d="M12 3l-4 2.5v3l4 2.5 4-2.5v-3L12 3Z"/>
      <path d="M12 3L8 5.5h8L12 3Z" opacity="0.7"/>

      {/* Loom Shuttle/Node 2 (Middle Left) */}
      <path d="M6 9.5l-3 2v3l3 2 3-2v-3l-3-2Z" transform="translate(0, 1)"/>
      <path d="M6 9.5L3 11.5h6L6 9.5Z" opacity="0.7" transform="translate(0, 1)"/>
      
      {/* Loom Shuttle/Node 3 (Middle Right) */}
      <path d="M18 9.5l-3 2v3l3 2 3-2v-3l-3-2Z" transform="translate(0, 1)"/>
      <path d="M18 9.5L15 11.5h6L18 9.5Z" opacity="0.7" transform="translate(0, 1)"/>

      {/* Loom Shuttle/Node 4 (Bottom) */}
      <path d="M12 16l-4 2.5v3l4 2.5 4-2.5v-3L12 16Z" transform="translate(0, 2)"/>
      <path d="M12 16L8 18.5h8L12 16Z" opacity="0.7" transform="translate(0, 2)"/>
      
      {/* Connecting Lines/Flow Arrows (Crystalline Strokes) */}
      {/* Top to Mid-Left */}
      <path d="M10.5 8L7.5 11.5M8 10l-.5.75.5.75" fill="none" stroke="currentColor" strokeWidth={sw * 0.5} strokeLinecap="round" strokeLinejoin="round"/>
      {/* Top to Mid-Right */}
      <path d="M13.5 8L16.5 11.5M16 10l.5.75-.5.75" fill="none" stroke="currentColor" strokeWidth={sw * 0.5} strokeLinecap="round" strokeLinejoin="round"/>
      {/* Mid-Left to Bottom */}
      <path d="M7.5 15.5L10.5 19M8 17.5l.75-.5.75.5" fill="none" stroke="currentColor" strokeWidth={sw * 0.5} strokeLinecap="round" strokeLinejoin="round" transform="translate(0,1)"/>
      {/* Mid-Right to Bottom */}
      <path d="M16.5 15.5L13.5 19M16 17.5l-.75-.5-.75.5" fill="none" stroke="currentColor" strokeWidth={sw * 0.5} strokeLinecap="round" strokeLinejoin="round" transform="translate(0,1)"/>
    </IconBase>
  );
};

export default LoomOrchestrationIcon;
