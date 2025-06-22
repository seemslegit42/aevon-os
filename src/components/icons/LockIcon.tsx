import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const LockIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Body */}
      <path d="M18 9h-1V6.5C17 4.01 14.99 2 12.5 2S8 4.01 8 6.5V9H7c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-9c0-1.1-.9-2-2-2zm-3.5 0H10V6.5C10 4.84 11.12 3.5 12.5 3.5S15 4.84 15 6.5V9z"/>
      <path d="M18 9H7L5 11v10l2 2h10l2-2V11L18 9z" opacity="0.6"/>
      
      {/* Keyhole */}
      <circle cx="12.5" cy="15.5" r="1" opacity="0.8"/>
      <path d="M12.5 16.5V18" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.7"/>
    </IconBase>
  );
});
LockIcon.displayName = 'LockIcon';

export default LockIcon;
