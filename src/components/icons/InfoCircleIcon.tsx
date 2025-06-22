import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const InfoCircleIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
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
      
      {/* 'i' Symbol - More Clearly Faceted */}
      {/* Dot of 'i' */}
      <path d="M12 6a1.75 1.75 0 1 0 0 3.5A1.75 1.75 0 0 0 12 6Z"/>
      <path d="M12 6l1-.75L12 4.5l-1 .75L12 6Z" className="if-o2"/>
      <path d="M12 9.5a1.75 1.75 0 0 0 0-3.5L10.25 7.75l1.75-1.5 1.75 1.5L12 9.5Z" className="if-o4" />
      <path d="M12 6l-.75.5h1.5L12 6Z" className="if-o6"/>
      {/* Stem of 'i' */}
      <path d="M10 10.5h4v7h-4V10.5Z"/>
      <path d="M10 10.5L12 9.25l2 1.25v7l-2 1.25L12 17.5V10.5Z" className="if-o1"/>
      <path d="M10 10.5v7l-1.25 1.25V9.25L10 10.5Z" className="if-o4"/>
      <path d="M14 10.5v7l1.25 1.25V9.25L14 10.5Z" className="if-o4"/>
      <path d="M12 9.25l-2 1.25h4l-2-1.25Z" className="if-o6"/>
    </IconBase>
  );
});
InfoCircleIcon.displayName = 'InfoCircleIcon';

export default InfoCircleIcon;
