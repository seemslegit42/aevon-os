import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const BellIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Main Bell Body */}
      <path d="M18 16V10.5C18 6.36 15.03 3.53 12 3.15V3a1 1 0 00-1-1h-2a1 1 0 00-1 1v.15C5.97 3.53 3 6.36 3 10.5V16l-2 2.5v.5h22v-.5L18 16z"/>
      {/* Clapper */}
      <path d="M12 21.5a2.5 2.5 0 01-2.45-3h4.9a2.5 2.5 0 01-2.45 3z" opacity="0.9"/>
      {/* Bell curve highlight */}
      <path d="M12 3.15C8.97 3.53 6 6.36 6 10.5h12c0-4.14-2.97-6.97-6-7.35V3.15z" opacity="0.5"/>
    </IconBase>
  );
});
BellIcon.displayName = 'BellIcon';

export default BellIcon;
