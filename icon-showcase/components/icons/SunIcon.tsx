
import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const SunIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Central Core */}
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 7.5a4.5 4.5 0 00-3.18 1.32L12 12V7.5Z" opacity="0.7"/>
      <circle cx="12" cy="12" r="2" opacity="0.4"/>

      {/* Sun Rays (Simplified) */}
      <path d="M12 2V5M12 19V22M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12H5M19 12H22M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8"/>
      {/* Ray Facets (subtle highlights on tips) */}
      <path d="M12 2l-1 1h2L12 2z M4.22 4.22l-.7.7 1.4 1.4.7-.7-1.4-1.4z M2 12l-1-1v2l1-1z" opacity="0.4"/>
    </IconBase>
  );
});
SunIcon.displayName = 'SunIcon';

export default SunIcon;
