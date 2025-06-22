
import React from 'react';
import IconBase, { ICON_GRADIENT_ID } from '../IconBase';
import { IconProps } from '../../types';

const AIPredictionIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 1.8;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline AI Prediction Icon */}
      {/* Background Graph/Trend Line */}
      <path d="M3 18l5-5 4 4 7-8" fill="none" stroke="currentColor" strokeWidth={sw * 0.5} strokeLinecap="round" strokeLinejoin="round" opacity="0.3"/>
      <path d="M3 18.5l4.5-5 .5.5 3.5 4 .5.5 6.5-8 .5.5" fill="none" stroke="currentColor" strokeWidth={sw * 0.3} strokeLinecap="round" strokeLinejoin="round" opacity="0.2"/>
      
      {/* Crystal Ball (Overlaying graph) */}
      <circle cx="12" cy="10" r="5.5" opacity="0.7"/>
      <path d="M12 4.5a5.5 5.5 0 0 0-3.89 1.61L12 10V4.5Z" opacity="0.5"/>
      <path d="M12 10a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z" opacity="0.3"/> {/* Inner core */}

      {/* Stand for Crystal Ball */}
      <path d="M9.5 15.5h5l-1 2h-3l-1-2Z" opacity="0.8"/>
      <path d="M9.5 15.5L12 14.5l2.5 1v2L12 18.5l-2.5-1v-2Z" opacity="0.6"/>

      {/* AI Sparkle/Glint on Crystal Ball */}
      <path d="M11 7.5l1-1.5 1 1.5-1 .5-1-.5Z M13.5 9.5l.5-1 .5 1-.5.5-.5-.5Z" fill="currentColor" opacity="0.9"/>
    </IconBase>
  );
};

export default AIPredictionIcon;
