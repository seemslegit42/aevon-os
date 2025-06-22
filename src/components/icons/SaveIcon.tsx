
import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const SaveIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Main body */}
      <path d="M19 2.5H5C3.9 2.5 3 3.4 3 4.5v15C3 20.6 3.9 21.5 5 21.5h14c1.1 0 2-.9 2-2V7.5L19 2.5Z" />
      <path d="M19 2.5L21 7.5h-5V2.5h3Z" opacity="0.7"/> {/* Top right corner cut/fold */}
      
      {/* Metal Shutter */}
      <path d="M15.5 3H7.5v7h8V3Z" opacity="0.8" />
      <path d="M7.5 3L11.5 2l4 1v7l-4 1-4-1V3Z" opacity="0.5"/>
      
      {/* Label Area */}
      <path d="M16 12H8v5h8v-5Z" opacity="0.6"/>
    </IconBase>
  );
});
SaveIcon.displayName = 'SaveIcon';

export default SaveIcon;
