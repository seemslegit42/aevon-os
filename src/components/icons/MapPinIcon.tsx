import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const MapPinIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Main pin shape */}
      <path d="M12 2C8.13 2 5 5.13 5 9c0 4.77 6.46 12.54 6.79 12.9L12 22l.21-.1c.33-.36 6.79-8.13 6.79-12.9C19 5.13 15.87 2 12 2zm0 10.5c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
      {/* Inner circle highlight */}
      <circle cx="12" cy="9" r="1.5" opacity="0.7"/>
    </IconBase>
  );
});
MapPinIcon.displayName = 'MapPinIcon';

export default MapPinIcon;
