
import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const MinimizeIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Crystalline Minimize Icon */}
      {/* Main Bar */}
      <path d="M4 11h16v2H4v-2Z"/>
      {/* Facets for 3D effect */}
      <path d="M4 11L12 10l8 1v2l-8 1-8-1v-2Z" opacity="0.6"/>
    </IconBase>
  );
});
MinimizeIcon.displayName = 'MinimizeIcon';

export default MinimizeIcon;
