import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const MoonIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Main Crescent Shape */}
      <path d="M12 2.5A9.5 9.5 0 1021.5 12 7.5 7.5 0 0112 2.5z"/>
      {/* Inner crescent highlight */}
      <path d="M12 2.5A9.5 9.5 0 004.26 7.3a7.5 7.5 0 017.74-4.8z" opacity="0.6"/>
      
      {/* Crater-like details (simplified) */}
      <circle cx="8" cy="8" r="1.2" opacity="0.3"/>
      <circle cx="11" cy="15" r="1" opacity="0.3"/>
      <circle cx="16" cy="9.5" r="0.8" opacity="0.3"/>
    </IconBase>
  );
});
MoonIcon.displayName = 'MoonIcon';

export default MoonIcon;
