import React from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const ProjectManagementIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 1.8;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline Project Management Icon (Gantt Chart Style) */}
      {/* Background Grid (subtle) */}
      <path d="M4 6h16M4 10h16M4 14h16M4 18h16M7 3v18M12 3v18M17 3v18" 
            stroke="currentColor" strokeWidth={sw*0.15} opacity="0.1" fill="none"/>

      {/* Task Bar 1 */}
      <path d="M5 5h8v3H5V5Z M5 5L9 4l4 1v3L9 9l-4-1V5Z" opacity="0.9"/>
      <path d="M5 5L9 4h4v1H5V5Z" opacity="0.6"/>

      {/* Task Bar 2 */}
      <path d="M8 9h10v3H8V9Z M8 9L13 8l5 1v3l-5 1-5-1V9Z" opacity="0.85"/>
      <path d="M8 9L13 8h5v1H8V9Z" opacity="0.55"/>

      {/* Task Bar 3 (Shorter, representing a milestone or different phase) */}
      <path d="M5 13h5v3H5v-3Z M5 13L7.5 12l2.5 1v3l-2.5 1-2.5-1v-3Z" opacity="0.9"/>
      <path d="M5 13L7.5 12h2.5v1H5v-1Z" opacity="0.6"/>
      
      {/* Checkmark/Progress indicator (crystalline) */}
      <path d="M19.5 14.5l-2 2-1-1 .5-.5 1 1 1.5-1.5 .5.5Z" fill="currentColor" opacity="0.7"/>
    </IconBase>
  );
};

export default ProjectManagementIcon;
