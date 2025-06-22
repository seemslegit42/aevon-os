import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const CloudIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Main Cloud Shape */}
      <path d="M19.35 9.04C18.67 5.68 15.64 3 12 3 9.11 3 6.6 4.64 5.35 7.04 2.34 7.36 0 9.91 0 13c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96Z"/>
      {/* Top surface highlights */}
      <path d="M12 3c-1.5 0-2.85.5-4 .85L12 9l4-5.15C14.85 3.5 13.5 3 12 3Z" opacity="0.6"/>
      <path d="M5.35 7.04A6.5 6.5 0 000 13l5.35 5.5L10 9.5A5.5 5.5 0 005.35 7.04Z" opacity="0.4"/>
      <path d="M18.65 7.04A5.5 5.5 0 0014 9.5l4.65 9L24 13a5 5 0 00-5.35-5.96Z" opacity="0.4"/>
    </IconBase>
  );
});
CloudIcon.displayName = 'CloudIcon';

export default CloudIcon;
