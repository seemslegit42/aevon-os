import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const CameraIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Main camera body */}
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM12 17.5a4.5 4.5 0 110-9 4.5 4.5 0 010 9z"/>
      {/* Lens */}
      <circle cx="12" cy="13" r="3" opacity="0.8"/>
      {/* Shutter button */}
      <circle cx="17.5" cy="7.5" r="1" opacity="0.7"/>
      {/* Viewfinder/flash area (optional) */}
       <path d="M4 4l2-2h12l2 2H4Z" opacity="0.4"/>
    </IconBase>
  );
});
CameraIcon.displayName = 'CameraIcon';

export default CameraIcon;
