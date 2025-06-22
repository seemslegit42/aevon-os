import React, { forwardRef } from 'react';
import IconBase, { ICON_GRADIENT_ID } from '../IconBase';
import { IconProps } from '../../types';

const MuteIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  const sw = strokeWidth || 2;
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Simplified Speaker Horn */}
      <path d="M3 9v6h4l5 5V4L7 9H3z" />
      <path d="M3 9L7 4h1v16H7L3 15V9z" opacity="0.6"/>

      {/* Slash Line using gradient for stroke */}
      <path d="M14 8l6 8M20 8l-6 8" fill="none" stroke={`url(#${ICON_GRADIENT_ID})`} strokeWidth={sw * 1.1} strokeLinecap="round"/>
    </IconBase>
  );
});
MuteIcon.displayName = 'MuteIcon';

export default MuteIcon;
