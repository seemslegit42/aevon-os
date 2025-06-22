
import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const CalendarIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Main calendar body */}
      <path d="M19 3H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
      {/* Rings */}
      <path d="M16 1.5V4.5M8 1.5V4.5" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.7"/>
      {/* Days (simplified) */}
      <rect x="7" y="10" width="2" height="2" rx="0.5" opacity="0.6"/>
      <rect x="11" y="10" width="2" height="2" rx="0.5" opacity="0.6"/>
      <rect x="15" y="10" width="2" height="2" rx="0.5" opacity="0.6"/>
      <rect x="7" y="14" width="2" height="2" rx="0.5" opacity="0.6"/>
    </IconBase>
  );
});
CalendarIcon.displayName = 'CalendarIcon';

export default CalendarIcon;
