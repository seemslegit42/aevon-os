
import React from 'react';
import IconBase, { ICON_GRADIENT_ID } from '../IconBase';
import { IconProps } from '../../types';

const BIMIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 1.7;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline BIM Icon */}
      {/* Layer 1 (Base/Foundation) */}
      <path d="M3 16h18v3H3v-3Z M3 16L12 14l9 2v3L12 21l-9-2v-3Z" opacity="0.7"/>
      <path d="M12 14L3 16h18L12 14Z" opacity="0.5"/>

      {/* Layer 2 (Walls/Structure) */}
      <path d="M5 10h14v5H5v-5Z M5 10L12 8l7 2v5l-7 2-7-2v-5Z" opacity="0.85"/>
      <path d="M12 8L5 10h14L12 8Z" opacity="0.6"/>
      
      {/* Layer 3 (Roof/Top Structure) */}
      <path d="M7 4h10v5H7V4Z M7 4L12 2l5 2v5l-5 2-5-2V4Z" opacity="0.95"/>
      <path d="M12 2L7 4h10L12 2Z" opacity="0.7"/>

      {/* Data Nodes (Small crystalline circles on layers) */}
      <circle cx="6" cy="17" r="1" fill="currentColor" opacity="0.6"/>
      <circle cx="18" cy="17" r="1" fill="currentColor" opacity="0.6"/>
      <circle cx="8" cy="12" r="1" fill="currentColor" opacity="0.6"/>
      <circle cx="16" cy="12" r="1" fill="currentColor" opacity="0.6"/>
      <circle cx="12" cy="6" r="1" fill="currentColor" opacity="0.6"/>

      {/* Connecting lines (subtle, representing data flow) */}
      <path d="M6 16V13M18 16V13M12 11V7" stroke={`url(#${ICON_GRADIENT_ID})`} strokeWidth={sw*0.3} strokeLinecap="round" opacity="0.4" fill="none"/>
    </IconBase>
  );
};

export default BIMIcon;
