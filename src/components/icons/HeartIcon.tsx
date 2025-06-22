import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const HeartIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Main Heart Shape */}
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      {/* Central highlight */}
      <path d="M12 21.35L3.45 12.81C2.57 11.93 2 10.59 2 8.5V8C5.42 8 7.5 10.09 7.5 10.09L12 14.59l4.5-4.5C16.5 10.09 18.58 8 22 8v.5c0 2.09-.57 3.43-1.45 4.31L12 21.35z" opacity="0.5"/>
    </IconBase>
  );
});
HeartIcon.displayName = 'HeartIcon';

export default HeartIcon;
