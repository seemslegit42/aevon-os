import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const ClockIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Clock face */}
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
      {/* Hour hand */}
      <path d="M12.5 7H11v5.5l4.5 2.68.74-1.28L12.5 11.5V7z" />
      {/* Minute hand (optional slight differentiation or rely on IconBase fill) */}
      {/* <path d="M12.5 7H11v7l5.25 3.15.75-1.22L12.5 12.5V7z" opacity="0.7" /> */}
       {/* Center pin */}
      <circle cx="12" cy="12" r="1" opacity="0.8"/>
    </IconBase>
  );
});
ClockIcon.displayName = 'ClockIcon';

export default ClockIcon;
