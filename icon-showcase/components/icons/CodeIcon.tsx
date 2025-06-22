
import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const CodeIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Left Angle Bracket */}
      <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4z"/>
      <path d="M9.4 16.6L8 18l-2.4-2.4L8 13.2l1.4 1.4-1.4 1.4z" opacity="0.5"/>
      {/* Right Angle Bracket */}
      <path d="M14.6 16.6l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
      <path d="M14.6 16.6l1.4 1.4L18.4 15.6l-1.4-1.4-1.4 1.4z" opacity="0.5"/>
    </IconBase>
  );
});
CodeIcon.displayName = 'CodeIcon';

export default CodeIcon;
