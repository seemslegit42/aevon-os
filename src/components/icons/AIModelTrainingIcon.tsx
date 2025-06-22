
import React from 'react';
import IconBase, { ICON_GRADIENT_ID } from '../IconBase';
import { IconProps } from '../../types';

const AIModelTrainingIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 1.8;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline AI Model Training Icon */}
      {/* Central AI Core/Brain (simplified) */}
      <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z M12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z"/>
      <path d="M12 8L10 10h4L12 8Z" opacity="0.7"/>
      <path d="M10 10v4l2 1.5V10h-2Z" opacity="0.5"/>
      <path d="M14 10v4l-2 1.5V10h2Z" opacity="0.5"/>

      {/* Incoming Data Streams (Arrows flowing into core) */}
      {/* Stream 1 (Top-Left) */}
      <path d="M6 5l3 3m-1-1.5h1.5V5M8 6.5L7.5 7" 
            fill="none" stroke={`url(#${ICON_GRADIENT_ID})`} strokeWidth={sw * 0.7} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 5l.75-.75 3 3-.75.75-3-3Z" opacity="0.4" fill="currentColor"/>
      
      {/* Stream 2 (Top-Right) */}
      <path d="M18 5l-3 3m1-1.5h-1.5V5M16 6.5L16.5 7" 
            fill="none" stroke={`url(#${ICON_GRADIENT_ID})`} strokeWidth={sw * 0.7} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18 5l-.75-.75-3 3 .75.75 3-3Z" opacity="0.4" fill="currentColor"/>

      {/* Stream 3 (Bottom-Center) */}
      <path d="M12 19l0-3m-1.5 1v1.5H12M10.5 17.5L11 17"
             fill="none" stroke={`url(#${ICON_GRADIENT_ID})`} strokeWidth={sw * 0.7} strokeLinecap="round" strokeLinejoin="round"/>
       <path d="M12 19l-.75-.75L12 16l.75.75L12 19Z" opacity="0.4" fill="currentColor"/>

      {/* Subtle processing/refinement animation hint (static representation) */}
      <circle cx="12" cy="12" r="1.5" fill="currentColor" opacity="0.2"/>
    </IconBase>
  );
};

export default AIModelTrainingIcon;
