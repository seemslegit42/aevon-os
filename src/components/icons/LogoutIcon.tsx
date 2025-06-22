import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const LogoutIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Door Frame - Sharper with more definition */}
      <path d="M10.5 22H3C2.17 22 1.5 21.33 1.5 20.5V3.5C1.5 2.67 2.17 2 3 2h7.5V3.5H3c-.28 0-.5.22-.5.5v16c0 .28.22.5.5.5h7.5V22Z"/>
      <path d="M10.5 3.5H3C2.72 3.5 2.5 3.72 2.5 4v16c0 .28.22.5.5.5h7.5V3.5Z" className="if-o2"/>
      <path d="M3 2L1.5 3.5v1L3 5.5v13L1.5 20v.5L3 22h7.5L10.5 2H3Z" className="if-o4"/>
      <path d="M10.5 2H3L1.5 3.5h9L10.5 2Z" className="if-o6"/> {/* Top frame edge */}
      
      {/* Arrow - Sharper and More Distinct 3D Facets */}
      <path d="M22.5 11.25l-5.5-5.5a1.25 1.25 0 0 0-1.77 0l-.9.9a1.25 1.25 0 0 0 0 1.77L17.58 11H7.5v2h10.08l-3.25 3.25a1.25 1.25 0 0 0 0 1.77l.9.9a1.25 1.25 0 0 0 1.77 0l5.5-5.5a1.25 1.25 0 0 0 0-1.77Z"/>
      <path d="M17 5.75l5.5 5.5-2.25 2.25L15.67 8.92l1.33-3.17Z" className="if-o1"/>
      <path d="M7.5 11h10.08L14.33 7.75a1.244 1.244 0 0 1 0-1.76l.9-.9 4.27 4.28-4.27 4.27-.9-.9a1.244 1.244 0 0 1 0-1.76L17.58 13H7.5v-2Z" className="if-o3"/>
      <path d="M22.5 11.25l-1.77 1.77-3.73-3.72L20.73 5.75l1.77 1.77a1.25 1.25 0 0 1 0 1.77l-1.77 1.96Z" className="if-o5"/>
      <path d="M17 5.75l-1.5-1.5L22.5 11.25l-1.5 1.5L17 5.75Z" className="if-o6"/> {/* Arrow shine */}
    </IconBase>
  );
});
LogoutIcon.displayName = 'LogoutIcon';

export default LogoutIcon;
