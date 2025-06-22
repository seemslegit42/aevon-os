import React from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const PluginIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 2;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline Plugin Icon (Puzzle Piece) */}
      <path d="M20.5 10.5h-4v-4c0-1.1-.9-2-2-2h-1V2.5h-3V4.5h-1c-1.1 0-2 .9-2 2v4h-4C3.67 10.5 3 11.17 3 12s.67 1.5 1.5 1.5h4v4c0 1.1.9 2 2 2h1v2h3V19.5h1c1.1 0 2-.9 2-2v-4h4c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5Z"/>
      
      {/* Top surface facets */}
      <path d="M11.5 2.5V4.5h1c.28 0 .5.22.5.5v4H15V7c0-1.1-.9-2-2-2h-1V2.5h-1Z" opacity="0.7"/>
      <path d="M20.5 10.5L19 12l-1.5-1.5h4v-1c0-.28-.22-.5-.5-.5h-2Z" opacity="0.6"/>
      
      {/* Side facets */}
      <path d="M4.5 10.5V9c0-1.1.9-2 2-2h4V5c0-.28-.22-.5-.5-.5h-1V2.5h-3V4.5h-1C4.12 4.5 3 5.62 3 7v4h1.5v-.5Z" opacity="0.5"/>
      <path d="M13.5 21.5V19.5h-1c-.28 0-.5-.22-.5-.5v-4H10.5V17c0 1.1.9 2 2 2h1v2.5h1Z" opacity="0.7"/>
    </IconBase>
  );
};

export default PluginIcon;
