
import React, { forwardRef } from 'react';
import IconBase, { ICON_GRADIENT_ID } from '../IconBase';
import { IconProps } from '../../types';

const VolumeDownIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  const sw = strokeWidth || 2;
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Simplified Speaker Horn */}
      <path d="M3 9v6h4l5 5V4L7 9H3z" />
      <path d="M3 9L7 4h1v16H7L3 15V9z" opacity="0.6"/>

      {/* Sound Wave using gradient for stroke */}
      <path d="M14.5 8.5a5 5 0 010 7" fill="none" stroke={`url(#${ICON_GRADIENT_ID})`} strokeWidth={sw * 0.9} strokeLinecap="round" />
    </IconBase>
  );
});
VolumeDownIcon.displayName = 'VolumeDownIcon';

export default VolumeDownIcon;
