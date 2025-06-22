import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const XCircleIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
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
      
      {/* X Symbol - More Clearly Faceted */}
      <path d="M16.5 6L12 10.5L7.5 6L6 7.5L10.5 12L6 16.5L7.5 18L12 13.5L16.5 18L18 16.5L13.5 12L18 7.5L16.5 6Z"/>
      {/* Facets for X symbol legs for sharper 3D */}
      <path d="M15 7L12 10l-3-3L8.25 6.25L12 9.5l3.75-3.25L15 7Z" className="if-o1"/>
      <path d="M16.5 6L18 7.5l-4.5 4.5-1.5-1.5L16.5 6Z" className="if-o4"/>
      <path d="M7.5 6L6 7.5l4.5 4.5 1.5-1.5L7.5 6Z" className="if-o4"/>
      <path d="M16.5 18L18 16.5l-4.5-4.5-1.5 1.5L16.5 18Z" className="if-o4"/>
      <path d="M7.5 18L6 16.5l4.5-4.5 1.5 1.5L7.5 18Z" className="if-o4"/>
      <path d="M12 10.5l-1.5-1.5h3L12 10.5Z" className="if-o6"/>
    </IconBase>
  );
});
XCircleIcon.displayName = 'XCircleIcon';

export default XCircleIcon;
