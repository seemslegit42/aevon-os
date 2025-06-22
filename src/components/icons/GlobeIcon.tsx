import React, { forwardRef } from 'react';
import IconBase, { ICON_GRADIENT_ID } from '../IconBase';
import { IconProps } from '../../types';

const GlobeIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  const sw = strokeWidth || 2;
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Sphere */}
      <circle cx="12" cy="10" r="8.5" />
      <path d="M12 1.5a8.5 8.5 0 00-6.36 2.74L12 10V1.5Z" opacity="0.7"/>
      
      {/* Stand Base */}
      <path d="M8.5 18.5s1.5 2 3.5 2 3.5-2 3.5-2H8.5Z" opacity="0.9"/>
      <path d="M12 15v5.5" fill="none" stroke={`url(#${ICON_GRADIENT_ID})`} strokeWidth={sw * 0.8} strokeLinecap="round" opacity="0.8"/>
      <path d="M15.5 18.5H8.5L12 17l3.5 1.5Z" opacity="0.5"/> {/* Base top facet */}

      {/* Landmasses / Grid Lines */}
      <path d="M5 12a7 7 0 0114 0M7 7.5a10 10 0 0110 0" 
            fill="none" stroke={`url(#${ICON_GRADIENT_ID})`} strokeOpacity="0.6" strokeWidth={sw * 0.5} strokeLinecap="round"/>
      <path d="M12 1.5c-2 3-3 5.5-3 8.5s1 5.5 3 8.5M12 1.5c2 3 3 5.5 3 8.5s-1 5.5-3 8.5" 
            fill="none" stroke={`url(#${ICON_GRADIENT_ID})`} strokeOpacity="0.4" strokeWidth={sw * 0.4} strokeLinecap="round"/>
    </IconBase>
  );
});
GlobeIcon.displayName = 'GlobeIcon';

export default GlobeIcon;
