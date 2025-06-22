
import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const ArrowRightIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Simplified Chevron Right Shape */}
      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
      {/* Optional subtle highlight for depth */}
      <path d="M8.59 16.59L13.17 12V14.5L8.59 16.59z" opacity="0.5"/>
      <path d="M13.17 12L8.59 7.41V9.5L13.17 12z" opacity="0.5"/>
    </IconBase>
  );
});
ArrowRightIcon.displayName = 'ArrowRightIcon';

export default ArrowRightIcon;
