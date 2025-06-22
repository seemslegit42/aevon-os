
import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const XIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Main X Shape */}
      <path d="M19.5 4.5L4.5 19.5l1.5 1.5L21 6l-1.5-1.5Z"/>
      <path d="M4.5 4.5L19.5 19.5l-1.5 1.5L3 6l1.5-1.5Z"/>
      
      {/* Facets for 3D crystalline effect */}
      <path d="M19.5 4.5L21 6l-15 15-1.5-1.5L19.5 4.5Z" opacity="0.6"/>
      <path d="M4.5 4.5L3 6l15 15 1.5-1.5L4.5 4.5Z" opacity="0.6"/>
      <path d="M12 10.5l1.5 1.5-1.5 1.5-1.5-1.5 1.5-1.5Z" opacity="0.8"/>
    </IconBase>
  );
});
XIcon.displayName = 'XIcon';

export default XIcon;
