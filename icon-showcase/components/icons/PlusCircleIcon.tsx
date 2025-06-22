
import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const PlusCircleIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
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
      
      {/* Plus Symbol - More Chiseled Facets */}
      <path d="M18 10.75H13.25V6H10.75v4.75H6v2.5h4.75V18h2.5v-4.75H18v-2.5Z"/>
      {/* Horizontal bar facets */}
      <path d="M18 10.75H6l1.25-1.25h9.5L18 10.75Z" className="if-o1"/>
      <path d="M18 13.25H6l1.25 1.25h9.5L18 13.25Z" className="if-o2"/>
      {/* Vertical bar facets */}
      <path d="M10.75 6V18l-1.25-1.25V7.25L10.75 6Z" className="if-o1"/>
      <path d="M13.25 6V18l1.25-1.25V7.25L13.25 6Z" className="if-o2"/>
      {/* Central intersection facets */}
      <path d="M10.75 10.75H13.25L12 9.5l-1.25 1.25Z" className="if-o5" />
      <path d="M10.75 13.25H13.25L12 14.5l-1.25-1.25Z" className="if-o5" />
    </IconBase>
  );
});
PlusCircleIcon.displayName = 'PlusCircleIcon';

export default PlusCircleIcon;
