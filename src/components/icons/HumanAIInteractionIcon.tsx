import React from 'react';
import IconBase, { ICON_GRADIENT_ID } from '../IconBase';
import { IconProps } from '../../types';

const HumanAIInteractionIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 1.7;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline Human-AI Interaction Icon */}
      {/* Human Silhouette (Left) */}
      <path d="M8 5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z M8 11c-2.08 0-5 .92-5 2.75V16h6.5c-.5-.75-1-1.6-1.25-2.5H3.5V13.75C3.5 12.5 5.92 11.8 8 11.8Z" opacity="0.9"/>
      <path d="M8 5L7 6.5l1 1 1-1-1-1Z" opacity="0.6"/>
      <path d="M3 14.75L8 12.5l2.5 2.25V16H3v-1.25Z" opacity="0.4"/>

      {/* Agent Silhouette (Right, distinct from AIBrainIcon) */}
      <path d="M16 5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z M16 11c1.5 0 3 .5 3.5 1.25v.25h1.25V11c0-2.5-3-3.5-4.75-3.5s-2.5.5-2.5 1.5v1.5h1.5V11Z" opacity="0.9"/>
      <path d="M16 5l-1.5 2h3L16 5Z" opacity="0.7"/> {/* Agent Head top facet */}
       <path d="M19.75 12.5V16h-6.5V12.5c0-.83.67-1.5 1.5-1.5h3.5c.83 0 1.5.67 1.5 1.5Z" opacity="0.5"/> {/* Agent Body */}


      {/* Connecting Interface (Crystalline Bridge/Beam) */}
      <path d="M10.5 10.5h3v3h-3v-3Z" /> {/* Central connector block */}
      <path d="M10.5 10.5L12 9.5l1.5 1v3l-1.5 1-1.5-1v-3Z" opacity="0.7"/>
      <path d="M8.5 12l2-1.5M15.5 12l-2-1.5" 
            fill="none" stroke={`url(#${ICON_GRADIENT_ID})`} strokeWidth={sw * 0.6} strokeLinecap="round" opacity="0.8"/>
    </IconBase>
  );
};

export default HumanAIInteractionIcon;
