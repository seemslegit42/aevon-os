import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const PlayIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Simplified Play Triangle */}
      <path d="M8 5v14l11-7L8 5z"/>
      {/* Optional subtle highlight for 3D feel */}
      <path d="M8 5l11 7v-1L8 5z" opacity="0.5"/>
      <path d="M8 19l11-7v1L8 19z" opacity="0.3"/>
    </IconBase>
  );
});
PlayIcon.displayName = 'PlayIcon';

export default PlayIcon;
