import React from 'react';
import IconBase, { ICON_GRADIENT_ID } from '../IconBase';
import { IconProps } from '../../types';

const AIBrainIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 1.8;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      <g fill={`url(#${ICON_GRADIENT_ID})`}>
        {/* Central Core - Clearer and More Defined */}
        <path d="M12 10a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
        {/* Outer Lobes/Nodes - More Defined and Recognizable Brain Shape */}
        {/* Upper Left Lobe */}
        <path d="M9.5 6A4 4 0 0 0 5.5 10c0 1.8.8 3.38 2 4.1L9.5 10.5V6Z" opacity="0.8"/>
        {/* Upper Right Lobe */}
        <path d="M14.5 6A4 4 0 0 1 18.5 10c0 1.8-.8 3.38-2 4.1L14.5 10.5V6Z" opacity="0.8"/>
        {/* Lower Structure (Brain Stem area) - Clearer */}
        <path d="M9 15.5s-.5 1.5-.5 3h7c0-1.5-.5-3-.5-3L12 17.5l-3-2Z" opacity="0.7"/>
      </g>
      <g fill="currentColor">
        <path d="M12 10L10.5 11.5l1.5 1.5 1.5-1.5L12 10Z" opacity="0.88"/> {/* Core top facet */}
        <circle cx="12" cy="13.5" r="1.25" opacity="0.35"/>
        <path d="M9.5 6L7.5 4.5l-2 1A4 4 0 0 0 5.5 10l1.5.6L9.5 6Z" opacity="0.6"/>
        <path d="M14.5 6L16.5 4.5l2 1A4 4 0 0 1 18.5 10l-1.5.6L14.5 6Z" opacity="0.6"/>
        <path d="M9 15.5L12 14l3 1.5-.5 1.5h-5L9 15.5Z" opacity="0.5"/>
        {/* Subtle Activation Points */}
        <path d="M7 9l-.75-.75 1.5 0-.75.75Z M17 9l-.75-.75 1.5 0-.75.75Z" opacity="0.35"/>
      </g>

      {/* Connecting Synapses - More Distinct Crystalline Paths */}
      <path d="M9.5 10.5s.5 1 2.5 1.5M14.5 10.5s-.5 1-2.5 1.5" 
            fill="none" stroke="currentColor" strokeWidth={sw * 0.6} strokeLinecap="round" opacity="0.65"/>
      <path d="M11 14.5s.4-.8 1-.8.6.6 1 .8" 
            fill="none" stroke="currentColor" strokeWidth={sw * 0.45} strokeLinecap="round" opacity="0.55"/>
    </IconBase>
  );
};

export default AIBrainIcon;
