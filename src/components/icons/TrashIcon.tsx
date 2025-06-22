import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const TrashIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Lid - More Defined Handle and Facets */}
      <path d="M3.5 5h17v3.5H3.5v-3.5Z"/>
      <path d="M7 3h10v3H7V3Z" className="if-o1"/>
      <path d="M20.5 5L12 3l-8.5 2h17Z" className="if-o2"/>
      <path d="M7 3L12 2l5 1H7Z" className="if-o3"/>
      <path d="M3.5 8.5h17V7H3.5v1.5Z" className="if-o5"/> {/* Lid underside */}
      
      {/* Body - Clearer Facets and Opening */}
      <path d="M5 9.5v11A2.5 2.5 0 0 0 7.5 23h9a2.5 2.5 0 0 0 2.5-2.5v-11H5Zm12 11H7V10.5h10v10Z"/>
      <path d="M7.5 9.5L5 20.5h1L7.5 10.5V9.5Z" className="if-o1"/>
      <path d="M16.5 9.5L19 20.5h-1L16.5 10.5V9.5Z" className="if-o1"/>
      <path d="M19 9.5H5V8.5c0-.28.22-.5.5-.5h13c.28 0 .5.22.5.5V9.5Z" className="if-o4"/>
      <path d="M5 20.5h14l-1.5-10H6.5L5 20.5Z" className="if-o6"/> {/* Body front shine */}
      
      {/* Ridges on body - more faceted */}
      <path d="M8.5 11.5l-1 1v4.5l1 1h2l1-1v-4.5l-1-1h-2Zm6 0l-1 1v4.5l1 1h2l1-1v-4.5l-1-1h-2Z" className="if-o5"/>
      <path d="M8.5 11.5L10.5 10.75l1.5.75v4.5l-1.5.75L10.5 16.25v-4.5Z M14.5 11.5L16.5 10.75l1.5.75v4.5l-1.5.75L16.5 16.25v-4.5Z" className="if-o5"/>
    </IconBase>
  );
});
TrashIcon.displayName = 'TrashIcon';

export default TrashIcon;
