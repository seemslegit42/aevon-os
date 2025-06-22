import React from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const AgentTaskManagementIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 1.8;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline Agent Task Management Icon */}
      {/* Agent Head (Central) */}
      <path d="M12 7a3.5 3.5 0 0 0-3.5 3.5c0 1.18.58 2.22 1.5 2.83V15h4v-1.67c.92-.61 1.5-1.65 1.5-2.83A3.5 3.5 0 0 0 12 7Z"/>
      <path d="M12 7L10 9h4L12 7Z" opacity="0.7"/>
      <path d="M8.5 10.5L12 13l3.5-2.5V15h-1.5v-1H10v1H8.5v-4.5Z" opacity="0.5"/>

      {/* Orbiting Task Blocks (Crystalline Cubes/Rectangles) */}
      {/* Task Block 1 (Top-Left) */}
      <path d="M5 5h3v3H5V5Z M5 5L6.5 4l1.5 1v3L6.5 9 5 8V5Z" opacity="0.8"/>
      {/* Task Block 2 (Top-Right) */}
      <path d="M16 5h3v3h-3V5Z M16 5L17.5 4l1.5 1v3L17.5 9 16 8V5Z" opacity="0.8"/>
      {/* Task Block 3 (Bottom-Center) */}
      <path d="M10.5 17h3v3h-3v-3Z M10.5 17L12 16l1.5 1v3L12 21l-1.5-1v-3Z" opacity="0.8"/>

      {/* Orbital Paths (Subtle, dotted or dashed effect if possible, else solid crystalline lines) */}
      <ellipse cx="12" cy="12" rx="8" ry="5.5" fill="none" stroke="currentColor" strokeWidth={sw*0.2} opacity="0.2" strokeDasharray="2 2"/>
      <ellipse cx="12" cy="12" rx="6" ry="7.5" fill="none" stroke="currentColor" strokeWidth={sw*0.15} opacity="0.15" strokeDasharray="1.5 1.5"/>
    </IconBase>
  );
};

export default AgentTaskManagementIcon;
