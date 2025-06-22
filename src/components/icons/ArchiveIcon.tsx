
import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const ArchiveIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Box Lid - Clearer Facets */}
      <path d="M1.5 2.5h21v6H1.5v-6Z" />
      <path d="M1.5 2.5L12 1l10.5 1.5v1.5L12 2.5l-10.5 1.5V2.5Z" className="if-o1"/> {/* Topmost facet */}
      <path d="M1.5 4L12 2l10.5 2v5L12 10l-10.5-1V4Z" className="if-o2"/> {/* Main lid volume */}
      <path d="M1.5 8.5H22.5V7L12 5.5l-10.5 1.5v1.5Z" className="if-o4"/> {/* Lid bottom edge */}
      <path d="M12 1L1.5 4h21L12 1Z" className="if-o6"/> {/* Lid top highlight */}
      
      {/* Box Body - Clearer Facets */}
      <path d="M2.5 9h19v12H2.5V9Z" />
      <path d="M2.5 9L12 7.25l9.5 1.75v1.5L12 9l-9.5 1.75V9Z" className="if-o2"/> {/* Top edge of body */}
      <path d="M2.5 10.75L12 9l9.5 1.75v10.5L12 23l-9.5-1.75V10.75Z" className="if-o3" /> {/* Main body volume */}
      <path d="M2.5 21H21.5V19.25l-9.5-1.75L2.5 19.25V21Z" className="if-o5"/> {/* Body bottom edge */}
      <path d="M2.5 9H21.5l-1 10.5H3.5L2.5 9Z" className="if-o6"/> {/* Front body shine */}
      
      {/* Handle/Label Plate - Sharper Facets */}
      <path d="M8.5 12.5h7v3h-7v-3Z" />
      <path d="M8.5 12.5L12 11.5l3.5 1v1.5L12 16l-3.5-1v-1.5Z" className="if-o1"/>
      <path d="M8.5 14.25L12 13.5l3.5.75v.5L12 15.5l-3.5-.75v-.5Z" className="if-o2"/>
      <path d="M10 13.5h4v1h-4v-1Z" className="if-o5"/>
    </IconBase>
  );
});
ArchiveIcon.displayName = 'ArchiveIcon';

export default ArchiveIcon;
