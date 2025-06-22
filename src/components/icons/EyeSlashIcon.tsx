
import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const EyeSlashIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  const sw = strokeWidth || 2; 

  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Eye Parts (partially obscured) */}
      <path d="M12 6.5c2.76 0 5.06 1.21 6.65 3.04L12 12l-2.5-2.5c.14-.15.29-.29.45-.42A6.46 6.46 0 0112 6.5zm5.98 6.54C16.54 15.29 14.24 16.5 12 16.5c-1.45 0-2.8-.47-3.96-1.26L12 12l5.98 2.98zM2 4.27l2.28 2.28C2.48 7.76 1 9.72 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84L19.73 21 21 19.73 3.27 3 2 4.27z" />
      <path d="M12 6.5L9.95 8.55A4.525 4.525 0 007.5 12H4.02c.17-1.02.55-1.97 1.09-2.82L2 4.27l1.27-1.27L7.18 7.02C8.34 5.74 10.07 5 12 5c.85 0 1.66.21 2.4.57L12 6.5z" opacity="0.6"/>
      {/* Slash Line */}
      <path 
        d="M3.27 3L21 19.73" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth={sw * 1.2} 
        strokeLinecap="round"
      />
    </IconBase>
  );
});
EyeSlashIcon.displayName = 'EyeSlashIcon';

export default EyeSlashIcon;
