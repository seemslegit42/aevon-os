import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const MailIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Main envelope body */}
      <path d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4.5l-8 5-8-5V6l8 5 8-5v2.5z"/>
      {/* Flap highlight */}
      <path d="M20 6L12 11 4 6V5.5L12 10.5l8-5V6Z" opacity="0.6"/>
    </IconBase>
  );
});
MailIcon.displayName = 'MailIcon';

export default MailIcon;
