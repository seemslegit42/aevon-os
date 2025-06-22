
import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const HomeIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Simplified house shape */}
      <path d="M12 3L3 10.5V21h18V10.5L12 3Z" />
      {/* Roof highlight/separation (optional subtle facet) */}
      <path d="M12 3L3 10.5L12 18L21 10.5L12 3Z" opacity="0.6"/>
      {/* Door */}
      <path d="M10.5 14h3v5h-3v-5Z" opacity="0.8"/>
    </IconBase>
  );
});
HomeIcon.displayName = 'HomeIcon';

export default HomeIcon;
