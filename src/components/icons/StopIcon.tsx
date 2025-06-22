import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const StopIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Main Square */}
      <path d="M4.5 4.5H19.5V19.5H4.5V4.5Z" />
      {/* Facets for Robust 3D Crystalline Look */}
      <path d="M4.5 4.5L12 2.5l7.5 2V19.5l-7.5 2L4.5 19.5V4.5Z" opacity="0.7" />
      <path d="M12 2.5L4.5 4.5h15L12 2.5Z" opacity="0.5"/> {/* Top Bevel Highlight */}
      <path d="M4.5 4.5V19.5L2.5 17.5V6.5L4.5 4.5Z" opacity="0.3"/> {/* Left Bevel */}
       <path d="M19.5 4.5V19.5L21.5 17.5V6.5L19.5 4.5Z" opacity="0.3"/> {/* Right Bevel */}
    </IconBase>
  );
});
StopIcon.displayName = 'StopIcon';

export default StopIcon;
