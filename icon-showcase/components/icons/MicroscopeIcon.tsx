
import React from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const MicroscopeIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 1.8;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline Microscope Icon */}
      {/* Base */}
      <path d="M5 20h14v2H5v-2Z M5 20L12 18.5l7 1.5v2L12 23.5l-7-1.5v-2Z" opacity="0.8"/>
      
      {/* Arm/Body */}
      <path d="M11 18.5V11c0-1.1.9-2 2-2h0c1.1 0 2 .9 2 2v2.5"/>
      <path d="M11 18.5L10 17v-6c0-1.1.45-2 1-2h2c.55 0 1 .9 1 2v3.5l-1 1V18.5h-2Z" opacity="0.7"/>

      {/* Eyepiece */}
      <path d="M14 4h-4v3h4V4Z M14 4L12 2.5l-2 1.5v3l2 1.5 2-1.5V4Z" opacity="0.9"/>
      <path d="M14 4H10l1-1h2l1 1Z" opacity="0.6"/>

      {/* Objective Lenses (Turret) */}
      <path d="M15.5 10a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" opacity="0.85"/>
      <path d="M13 7.5L11.5 8.5l1.5 1.5 1.5-1.5L13 7.5Z" opacity="0.6"/>
      <path d="M11.5 11l-1-1h5l-1 1h-3Z" opacity="0.4"/> {/* Lens ends */}
      
      {/* Stage */}
      <path d="M7 14h10v1.5H7v-1.5Z M7 14L12 13l5 1v1.5L12 16.5l-5-1V14Z" opacity="0.75"/>
      
      {/* Light Source (under stage, subtle) */}
      <path d="M11 16.5h2v1h-2v-1Z" opacity="0.3"/>
    </IconBase>
  );
};

export default MicroscopeIcon;
