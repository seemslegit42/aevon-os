import React from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const ThreeDPrintedStructureIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 1.8;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline 3D Printed Structure Icon */}
      {/* Extruder Nozzle */}
      <path d="M12 2.5l-3 4h6l-3-4Z"/> {/* Tip */}
      <path d="M12 2.5L10.5 5h3L12 2.5Z" opacity="0.7"/>
      <path d="M10.5 6.5h3v3h-3v-3Z"/> {/* Body */}
      <path d="M10.5 6.5L12 5.5l1.5 1v3l-1.5 1-1.5-1v-3Z" opacity="0.6"/>

      {/* Extruded Beam / Structure (growing downwards) */}
      <path d="M10 9.5h4v10l-2 2-2-2v-10Z"/>
      {/* Facets on the beam */}
      <path d="M10 9.5L12 8.5l2 1v10l-2 1-2-1v-10Z" opacity="0.7"/>
      <path d="M10 19.5l2 2V13l-2-1v7.5Z" opacity="0.5"/>
      <path d="M14 19.5l-2 2V13l2-1v7.5Z" opacity="0.5"/>
      
      {/* Layer Lines (subtle, on the beam) */}
      <path d="M10.5 12h3M10.5 15h3M10.5 18h3" 
            stroke="currentColor" strokeWidth={sw*0.2} strokeLinecap="round" opacity="0.3" fill="none"/>
    </IconBase>
  );
};

export default ThreeDPrintedStructureIcon;
