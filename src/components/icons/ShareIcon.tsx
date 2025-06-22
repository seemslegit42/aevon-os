
import React, { forwardRef } from 'react';
import IconBase, { ICON_GRADIENT_ID } from '../IconBase';
import { IconProps } from '../../types';

const ShareIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  const sw = strokeWidth || 2;
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Main node */}
      <circle cx="18" cy="5" r="3" />
      <path d="M18 2a3 3 0 00-2.12 5.12L18 8l2.12-.88A3 3 0 0018 2Z" opacity="0.6"/>
      
      {/* Bottom left node */}
      <circle cx="6" cy="12" r="3" />
       <path d="M6 9a3 3 0 00-2.12 5.12L6 15l2.12-.88A3 3 0 006 9Z" opacity="0.6"/>

      {/* Bottom right node */}
      <circle cx="18" cy="19" r="3" />
      <path d="M18 16a3 3 0 00-2.12 5.12L18 22l2.12-.88A3 3 0 0018 16Z" opacity="0.6"/>

      {/* Connecting lines */}
      <path d="M15.9 6.5L8.1 10.5M8.1 13.5l7.8 4" 
            fill="none" stroke={`url(#${ICON_GRADIENT_ID})`} strokeWidth={sw*0.7} strokeLinecap="round"/>
    </IconBase>
  );
});
ShareIcon.displayName = 'ShareIcon';

export default ShareIcon;
