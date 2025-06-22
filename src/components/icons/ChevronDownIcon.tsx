import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const ChevronDownIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Simplified Chevron Shape */}
      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
      {/* Optional subtle highlight for depth */}
      <path d="M7.41 8.59L12 13.17V10L7.41 8.59z" opacity="0.5"/>
      <path d="M16.59 8.59L12 13.17V10L16.59 8.59z" opacity="0.5"/>
    </IconBase>
  );
});
ChevronDownIcon.displayName = 'ChevronDownIcon';

export default ChevronDownIcon;
