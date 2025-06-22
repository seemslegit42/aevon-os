import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const AlertTriangleIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Sharpened Alert Triangle Shape */}
      <path d="M1 21h22L12 2 1 21zm11-3h-2v-2h2v2zm0-4h-2V9h2v5z"/>
      {/* Facets for depth */}
      <path d="M12 2L1 21h11V2z" opacity="0.6"/>
      <path d="M12 5.09L3.62 20h16.76L12 5.09zM11 16h2v2h-2v-2zm0-7h2v5h-2V9z" opacity="0.8"/>
    </IconBase>
  );
});
AlertTriangleIcon.displayName = 'AlertTriangleIcon';

export default AlertTriangleIcon;
