
import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const SearchIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Magnifying glass main body */}
      <path d="M15.5 14h-.79l-.28-.27A6.5 6.5 0 105 9.5a6.5 6.5 0 009.23 5.23l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
      {/* Inner Lens highlight (optional) */}
      <circle cx="9.5" cy="9.5" r="3" opacity="0.5"/>
    </IconBase>
  );
});
SearchIcon.displayName = 'SearchIcon';

export default SearchIcon;
