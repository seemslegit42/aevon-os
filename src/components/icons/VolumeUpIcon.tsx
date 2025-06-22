
import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const VolumeUpIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  const sw = strokeWidth || 2;
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Simplified Speaker Horn */}
      <path d="M3 9v6h4l5 5V4L7 9H3z" />
      <path d="M3 9L7 4h1v16H7L3 15V9z" opacity="0.6"/>

      {/* Sound Waves using gradient for stroke */}
      <path d="M14.5 8.5a5 5 0 010 7" fill="none" stroke="currentColor" strokeWidth={sw * 0.9} strokeLinecap="round" />
      <path d="M17.5 5.5a9 9 0 010 13" fill="none" stroke="currentColor" strokeWidth={sw * 0.7} strokeLinecap="round" opacity="0.7"/>
    </IconBase>
  );
});
VolumeUpIcon.displayName = 'VolumeUpIcon';

export default VolumeUpIcon;
