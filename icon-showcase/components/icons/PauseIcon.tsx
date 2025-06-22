
import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const PauseIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Left Bar */}
      <path d="M6 4.5H10V19.5H6V4.5Z" />
      <path d="M6 4.5L8 3l2 1.5V19.5L8 21l-2-1.5V4.5Z" opacity="0.7" />
      
      {/* Right Bar */}
      <path d="M14 4.5H18V19.5H14V4.5Z" />
      <path d="M14 4.5L16 3l2 1.5V19.5L16 21l-2-1.5V4.5Z" opacity="0.7" />
    </IconBase>
  );
});
PauseIcon.displayName = 'PauseIcon';

export default PauseIcon;
