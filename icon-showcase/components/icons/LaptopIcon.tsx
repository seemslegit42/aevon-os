
import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const LaptopIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Screen */}
      <path d="M20 3H4C2.9 3 2 3.9 2 5v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 12H6V7h12v8z"/>
      <path d="M20 3L12 2 4 3v2h16V3Z" opacity="0.6" /> {/* Screen top bevel */}
      
      {/* Base */}
      <path d="M22 18H2v1.5c0 .28.22.5.5.5h19c.28 0 .5-.22.5-.5V18Z"/>
      <path d="M2 18l10-1 10 1v1.5L12 20l-10-1.5V18Z" opacity="0.5" /> {/* Base front facet */}
    </IconBase>
  );
});
LaptopIcon.displayName = 'LaptopIcon';

export default LaptopIcon;
