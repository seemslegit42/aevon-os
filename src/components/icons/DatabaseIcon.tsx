import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const DatabaseIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Top disk - Clearer Surface and Edge */}
      <ellipse cx="12" cy="5.5" rx="10" ry="4"/>
      <path d="M12 1.5A10 4 0 0 0 2 5.5a10 4 0 0 0 10 4A10 4 0 0 0 22 5.5A10 4 0 0 0 12 1.5Z" className="if-o2"/>
      <path d="M2 5.5v1.5c0 2.21 4.48 4 10 4s10-1.79 10-4V5.5L12 8.5 2 5.5Z" className="if-o4"/>
      <path d="M22 5.5L12 1.5 2 5.5h20Z" className="if-o6"/>
      
      {/* Middle disk - Clearer Surface and Edge */}
      <ellipse cx="12" cy="12" rx="10" ry="4" className="if-o1"/>
      <path d="M2 12V10.5c0-2.21 4.48-4 10-4s10 1.79 10 4V12c0 2.21-4.48 4-10 4s-10-1.79-10-4Z" className="if-o2"/>
      <path d="M2 12v1.5c0 2.21 4.48 4 10 4s10-1.79 10-4V12L12 15 2 12Z" className="if-o5"/>
      <path d="M22 12L12 10.5H2l10 1.5h10Z" className="if-o6"/>

      {/* Bottom disk - Clearer Surface and Edge */}
      <ellipse cx="12" cy="18.5" rx="10" ry="4"/>
      <path d="M2 18.5V17c0-2.21 4.48-4 10-4s10 1.79 10 4v1.5c0 2.21-4.48 4-10 4s-10-1.79-10-4Z" className="if-o2"/>
      <path d="M2 18.5L12 15.5l10 3V20c0 2.21-4.48 4-10 4S2 22.21 2 20v-1.5Z" className="if-o4"/>
      <path d="M22 18.5L12 17H2l10 1.5h10Z" className="if-o6"/>

      {/* Side Walls - more defined connection between disks */}
      <path d="M2 5.5V18.5c0 1.1.86 2.08 2.5 2.85V2.65C2.86 3.42 2 4.39 2 5.5Z" className="if-o4"/>
      <path d="M22 5.5V18.5c0 1.1-.86 2.08-2.5 2.85V2.65C21.14 3.42 22 4.39 22 5.5Z" className="if-o4"/>
    </IconBase>
  );
});
DatabaseIcon.displayName = 'DatabaseIcon';

export default DatabaseIcon;
