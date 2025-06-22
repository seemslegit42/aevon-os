
import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const XIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Crystalline X Icon */}
      {/* Main X Shape */}
      <path d="M18.75 3.75L3.75 18.75l1.5 1.5L20.25 5.25l-1.5-1.5Z"/>
      <path d="M5.25 3.75L20.25 18.75l-1.5 1.5L3.75 5.25l1.5-1.5Z"/>
      
      {/* Facets for 3D effect */}
      <path d="M18.75 3.75l-7.5 7.5 1.5 1.5 7.5-7.5-1.5-1.5Z" opacity="0.6"/>
      <path d="M5.25 3.75l7.5 7.5-1.5 1.5-7.5-7.5 1.5-1.5Z" opacity="0.6"/>
      <path d="M18.75 20.25l-7.5-7.5 1.5-1.5 7.5 7.5-1.5 1.5Z" opacity="0.4"/>
      <path d="M5.25 20.25l7.5-7.5-1.5-1.5-7.5 7.5 1.5 1.5Z" opacity="0.4"/>
      <path d="M12 12l2.25-2.25L12 7.5 9.75 9.75 12 12Z" opacity="0.8"/>
    </IconBase>
  );
});
XIcon.displayName = 'XIcon';

export default XIcon;
