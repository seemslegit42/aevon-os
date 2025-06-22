
import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const FilterIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Main funnel shape - Sleeker and More Nuanced Faceting */}
      <path d="M23 2.5H1L9.5 12.75V19l5 3.75V12.75L23 2.5Z"/>
      
      {/* Top opening facet - More Defined */}
      <path d="M23 2.5L12 10 1 2.5h22Z" className="if-o1"/>
      <path d="M1 2.5L12 2 23 2.5l-11 7.5L1 2.5Z" className="if-o5"/> {/* Highlight on top edge */}
      
      {/* Side facet left - Clearer */}
      <path d="M1 2.5L9.5 12.75V18l-4.25 2.5V9L1 2.5Z" className="if-o1"/>
      
      {/* Side facet right - Clearer */}
      <path d="M23 2.5L14.5 12.75V18l4.25 2.5V9L23 2.5Z" className="if-o1"/>
      <path d="M9.5 12.75L1 2.5l1.5-1L9.5 10l-1.5 2.75Z" className="if-o6"/>
      <path d="M14.5 12.75L23 2.5l-1.5-1L14.5 10l1.5 2.75Z" className="if-o6"/>
      
      {/* Spout - More Chiseled and 3D */}
      <path d="M9.5 19l2.5-2.13 2.5 2.13V22.75h-5V19Z" className="if-o1"/>
      <path d="M9.5 19L12 16.87l2.5 2.13v2.5L12 21.25l-2.5-1.88V19Z" className="if-o2"/>
      <path d="M14.5 22.75H9.5L12 24l2.5-1.25Z" className="if-o4" /> {/* Spout bottom facet */}
    </IconBase>
  );
});
FilterIcon.displayName = 'FilterIcon';

export default FilterIcon;
