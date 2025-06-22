import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const ImageIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Outer frame / main body - Sharper Edges, More Pronounced Bevel */}
      <path d="M22.5 1.5H1.5C.67 1.5 0 2.17 0 3v18c0 .83.67 1.5 1.5 1.5h21c.83 0 1.5-.67 1.5-1.5V3c0-.83-.67-1.5-1.5-1.5ZM2 19.5V4.5h20v15H2Z"/>
      <path d="M1.5 4.5h21V3c0-.55-.45-1-1-1H2.5c-.55 0-1 .45-1 1v1.5Z" className="if-o1"/> {/* Top edge bevel */}
      <path d="M0 5L12 2l12 3v14L12 22L0 19V5Z" className="if-o3"/> {/* Frame volume shadow */}
      <path d="M21 21H3V4.5h18V21Z" className="if-o6" /> {/* Inner surface shadow */}
      <path d="M24 3L22.5 1.5H1.5L0 3v1.5h24V3Z" className="if-o5"/> {/* Top surface highlight */}
      <path d="M0 21V3l.75-1.5h22.5L24 3v18l-.75 1.5H.75L0 21Z" className="if-o6" fillRule="evenodd"/>

      {/* Internal "picture" area - Stylized Landscape with Crisper Crystalline Facets */}
      {/* Sun facet - More Defined and Jewel-Like */}
      <path d="M7 5.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" className="if-o1"/>
      <path d="M7 5.5L5.75 3.75l1.25-1.25 1.25 1.25L7 5.5Z" className="if-o2"/>
      <path d="M7 .5L5.75 3H8.25L7 .5Z" className="if-o5"/>
      <path d="M7 3a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Z" className="if-o6"/>

      {/* Mountain/landscape facets - Sharper, More Distinct Crystalline Shapes */}
      <path d="M2 19.5l6-7.5 4.5 5 5-7-5.5 5L22 19.5H2Z" className="if-o1"/>
      <path d="M15.5 9.5l-4 4.5L8.5 11l-5 6.5H22l-3-3.5Z" className="if-o3"/> 
      <path d="M2 19.5L9 10l2 2L15 8l7 8V19.5H2Z" className="if-o5"/>
      <path d="M2 19.5l6-7.5h3.5l-3.5 4.5 5-7h3.5L16 19.5H2Z" className="if-o6" fillRule="evenodd"/>
    </IconBase>
  );
});
ImageIcon.displayName = 'ImageIcon';

export default ImageIcon;
