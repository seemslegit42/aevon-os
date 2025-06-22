
import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const MinimizeIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Main Bar */}
      <path d="M5 11h14v2H5v-2Z" />
      {/* Facets for depth */}
      <path d="M5 11L12 10l7 1v2l-7-1-7 1v-2Z" opacity="0.6"/>
    </IconBase>
  );
});
MinimizeIcon.displayName = 'MinimizeIcon';

export default MinimizeIcon;
