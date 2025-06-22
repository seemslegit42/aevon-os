import React from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const MedicalNanobotIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 1.5;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline Medical Nanobot Icon */}
      {/* Central Nanobot */}
      <path d="M12 10l-1.5-2.5 3 0L12 10zm0 4l1.5 2.5-3 0L12 14zm-3-2h6l-1.5-1.5L12 11l-1.5.5L9 12z"/>
      <path d="M12 7.5L10.5 10h3L12 7.5Z" opacity="0.7"/>
      <path d="M12 16.5L10.5 14h3L12 16.5Z" opacity="0.7"/>
      <path d="M9 12l1.5-1.5v3L9 12Z" opacity="0.6"/>
      <path d="M15 12l-1.5-1.5v3L15 12Z" opacity="0.6"/>

      {/* Surrounding smaller Nanobots/Particles */}
      {/* Top-left */}
      <path d="M7 7l-1-1.5 2 0L7 7zm0 1.5l1 1.5-2 0L7 8.5zm-1 .75h2l-.75-.75L6 9.25l-.75-.75Z" transform="scale(0.7) translate(3,3)" opacity="0.8"/>
      {/* Top-right */}
      <path d="M17 7l-1-1.5 2 0L17 7zm0 1.5l1 1.5-2 0L17 8.5zm-1 .75h2l-.75-.75L16 9.25l-.75-.75Z" transform="scale(0.7) translate(8,3)" opacity="0.8"/>
      {/* Bottom-left */}
      <path d="M7 17l-1-1.5 2 0L7 17zm0 1.5l1 1.5-2 0L7 18.5zm-1 .75h2l-.75-.75L6 19.25l-.75-.75Z" transform="scale(0.7) translate(3,8)" opacity="0.8"/>
      {/* Bottom-right */}
      <path d="M17 17l-1-1.5 2 0L17 17zm0 1.5l1 1.5-2 0L17 18.5zm-1 .75h2l-.75-.75L16 19.25l-.75-.75Z" transform="scale(0.7) translate(8,8)" opacity="0.8"/>
      
      {/* Subtle Medical Cross hint in background (very faint) */}
      <path d="M11 5h2v2h2v2h-2v2h-2v-2H9V7h2V5Z" opacity="0.07" fill="currentColor"/>
    </IconBase>
  );
};

export default MedicalNanobotIcon;
