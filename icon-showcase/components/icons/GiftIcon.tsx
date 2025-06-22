
import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const GiftIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Box Body - Crisper Edges */}
      <path d="M22 8.5H2v11.5h20V8.5Z"/>
      <path d="M2 8.5L12 5.5l10 3v11.5L12 23l-10-3V8.5Z" className="if-o3"/>
      <path d="M22 8.5H2l2.5 2.5h15L22 8.5Z" className="if-o1" /> {/* Top edge of box body */}
      <path d="M2 20h20V18l-10 2L2 18v2Z" className="if-o5"/> {/* Bottom edge of box body */}
      <path d="M22 8.5l-2 1.5H4l-2-1.5Z" className="if-o6"/> {/* Lid overhang shadow on box */}
      
      {/* Lid - More Defined */}
      <path d="M23 5.5H1v3.5h22V5.5Z"/>
      <path d="M1 5.5L12 2.5l11 3v3.5L12 12l-11-3V5.5Z" className="if-o2"/>
      <path d="M1 9H23V7.5L12 6l-11 1.5V9Z" className="if-o4"/> {/* Lid bottom edge */}
      <path d="M12 2.5L1 5.5h22L12 2.5Z" className="if-o6"/> {/* Lid top highlight */}

      {/* Ribbon - Vertical, More 3D */}
      <path d="M10.5 2.5h3v21h-3V2.5Z"/>
      <path d="M10.5 2.5L12 2l1.5.5v21l-1.5.5L12 23V2.5Z" className="if-o1"/>
      <path d="M10.5 2.5L9 23h1.5V2.5ZM13.5 2.5L15 23h-1.5V2.5Z" className="if-o5"/>

      {/* Bow - More Sculpted and Faceted */}
      <path d="M12 2.5C8.5 2.5 7 0 7 0S10-1.5 12-1.5s3.5 1.5 5 1.5c2 1.5 1.5 2.5-1 3.5S15.5 2.5 12 2.5Z"/>
      <path d="M12 2.5c2 0 3.5-.9 4-2.25S14-1.5 12-1.5s-2.5.75-3 2.25S9.5 2.5 12 2.5Z" className="if-o1"/>
      <path d="M12 2.5l-2-1.5h4L12 2.5Z" className="if-o2"/> {/* Central knot facet */}
      <path d="M7 0S10 1.5 12 1.5s2-1.5 2-1.5H7Z" className="if-o5"/> {/* Underside of bow loops */}
      <path d="M12 -1.5L9 .5l3-1 3 1L12 -1.5Z" className="if-o6"/> {/* Top of knot */}
    </IconBase>
  );
});
GiftIcon.displayName = 'GiftIcon';

export default GiftIcon;
