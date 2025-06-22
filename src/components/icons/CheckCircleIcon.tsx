import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const CheckCircleIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Circle Body - More Distinct Bevel */}
      <path d="M12 1C5.93 1 1 5.93 1 12s4.93 11 11 11 11-4.93 11-11S18.07 1 12 1Zm0 20.5c-5.25 0-9.5-4.25-9.5-9.5S6.75 2.5 12 2.5s9.5 4.25 9.5 9.5S17.25 21.5 12 21.5Z"/>
      <path d="M12 2.5a9.5 9.5 0 0 0-9.5 9.5h1A8.5 8.5 0 0 1 12 3.5V2.5Z" className="if-o1"/>
      <path d="M12 2.5a9.5 9.5 0 0 1 9.5 9.5h-1A8.5 8.5 0 0 0 12 3.5V2.5Z" className="if-o1"/>
      <path d="M12 21.5a9.5 9.5 0 0 1-9.5-9.5h1A8.5 8.5 0 0 0 12 20.5V21.5Z" className="if-o3"/>
      <path d="M12 21.5a9.5 9.5 0 0 0 9.5-9.5h-1A8.5 8.5 0 0 1 12 20.5V21.5Z" className="if-o3"/>
      <path d="M2.5 12A9.5 9.5 0 0 0 12 21.5v-1A8.5 8.5 0 0 1 3.5 12H2.5Z" className="if-o5"/>
      <path d="M21.5 12A9.5 9.5 0 0 1 12 21.5v-1A8.5 8.5 0 0 0 20.5 12H21.5Z" className="if-o5"/>
      
      {/* Checkmark Symbol - More Clearly Faceted */}
      <path d="M9.5 16L5.5 12l1.75-1.75L9.5 12.5l6.75-6.75L18 7.5L9.5 16Z"/>
      <path d="M16.25 5.75L9.5 12.5l-2.25-2.25L6.5 10.9l3 3 .75.75L9.5 14.3l6.75-6.75-1.75-1.8Z" className="if-o1"/>
      <path d="M5.5 12l1.75-1.75L9.5 12.5v3.5L8.75 16.75l-3.25-3.25Z" className="if-o2"/>
      <path d="M18 7.5L16.25 5.75l-6.75 6.75L10.25 13.25 18 7.5Z" className="if-o4"/>
      <path d="M9.5 12.5l-4-4L5 9l4.5 4.5L9.5 12.5Z" className="if-o6"/>
    </IconBase>
  );
});
CheckCircleIcon.displayName = 'CheckCircleIcon';

export default CheckCircleIcon;
