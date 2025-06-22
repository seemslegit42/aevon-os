import React from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const RoboticSurgeryArmIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 1.7;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline Robotic Surgery Arm Icon */}
      {/* Base/Mount */}
      <path d="M4 18h4v2H4v-2Z M4 18L6 17l2 1v2l-2 1-2-1v-2Z" opacity="0.7"/>
      
      {/* First Arm Segment */}
      <path d="M7 17.5L10 12l1.5 1-3 5.5H7Z"/>
      <path d="M7 17.5l3-5.5.75.75L7.5 18H7v-.5Z" opacity="0.6"/>

      {/* Joint 1 */}
      <circle cx="10.5" cy="11.5" r="1.5" opacity="0.8"/>
      <path d="M10.5 10L9.75 10.75l.75.75.75-.75-.75-.75Z" opacity="0.5"/>

      {/* Second Arm Segment */}
      <path d="M11 11L16.5 5.5l1 1L12 12l-1-1Z"/>
      <path d="M11 11l5.5-5.5.5.5L11.5 11.5l-.5-.5Z" opacity="0.6"/>

      {/* Joint 2 / Wrist */}
      <circle cx="17" cy="5" r="1.25" opacity="0.8"/>
       <path d="M17 3.75L16.25 4.5l.75.75.75-.75-.75-.75Z" opacity="0.5"/>

      {/* Surgical Tool (Scalpel-like) */}
      <path d="M17.5 4.5L21 1l-1-1-3.5 3.5.5.5.5-.5Z"/> {/* Handle part of tool */}
      <path d="M21 1l-1.5 1.5L18 1l1.5-1.5L21 1Z" opacity="0.7"/> {/* Blade facet */}
      <path d="M19.5 2.5L18 4l-1-1 2.5-2.5.5.5Z" opacity="0.5"/>
    </IconBase>
  );
};

export default RoboticSurgeryArmIcon;
