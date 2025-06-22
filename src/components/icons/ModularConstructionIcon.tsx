import React from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const ModularConstructionIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 1.8;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline Modular Construction Icon */}
      {/* Block 1 (Bottom Left) */}
      <path d="M3 14h6v6H3v-6Z M3 14l3-2 3 2v6l-3 2-3-2v-6Z"/>
      <path d="M3 14l3-2h3l-1.5 1L6 14H3Z" opacity="0.6"/> {/* Top face */}

      {/* Block 2 (Bottom Right, interlocking) */}
      <path d="M10 14h6v6h-6v-6Z M10 14l3-2 3 2v6l-3 2-3-2v-6Z" transform="translate(5,0)"/>
      <path d="M10 14l3-2h3l-1.5 1L13 14h-3Z" opacity="0.6" transform="translate(5,0)"/>
      
      {/* Block 3 (Top Center, interlocking) */}
      <path d="M7.5 6h6v6h-6V6Z M7.5 6l3-2 3 2v6l-3 2-3-2V6Z" transform="translate(1.5,1)"/>
      <path d="M7.5 6l3-2h3l-1.5 1L10.5 6h-3Z" opacity="0.6" transform="translate(1.5,1)"/>

      {/* Connector piece (visual suggestion) Block 1 to 3 */}
      <path d="M8.5 12.5L10 11V9.5h1V11l1.5 1.5-1.5 1.5h-1L8.5 12.5Z" opacity="0.4"/>
      {/* Connector piece (visual suggestion) Block 2 to 3 */}
      <path d="M13.5 12.5L12 11V9.5h1V11l1.5 1.5-1.5 1.5h-1L13.5 12.5Z" opacity="0.4" transform="translate(3,0)"/>

      {/* Subtle lines indicating modularity/assembly */}
      <path d="M9 14V12.5 M15 14V12.5 M12 12V10.5" stroke="currentColor" strokeWidth={sw*0.2} strokeLinecap="round" opacity="0.2"/>
    </IconBase>
  );
};

export default ModularConstructionIcon;
