
import React, { forwardRef } from 'react';
import IconBase, { ICON_GRADIENT_ID } from '../IconBase';
import { IconProps } from '../../types';

const ShieldIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Main shield body */}
      <path d="M12 2L3 5.5v6.65C3 17.8 6.84 22 12 22s9-4.2 9-9.85V5.5L12 2Z" fill={`url(#${ICON_GRADIENT_ID})`}/>
      {/* Optional highlight/facet for depth */}
      <path d="M12 2L3 5.5L12 9L21 5.5L12 2Z" fill="currentColor" opacity="0.6"/>
      <path d="M12 22C6.84 22 3 17.8 3 12.15V5.5L12 9V22Z" fill="currentColor" opacity="0.3"/>
    </IconBase>
  );
});
ShieldIcon.displayName = 'ShieldIcon';

export default ShieldIcon;
