import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const ArrowLeftIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Simplified Chevron Left Shape */}
      <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
      {/* Optional subtle highlight for depth */}
      <path d="M15.41 16.59L10.83 12V14.5L15.41 16.59z" opacity="0.5"/>
      <path d="M10.83 12l4.58-4.59V9.5L10.83 12z" opacity="0.5"/>
    </IconBase>
  );
});
ArrowLeftIcon.displayName = 'ArrowLeftIcon';

export default ArrowLeftIcon;
