import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const BriefcaseIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Main body - More Defined Blockiness */}
      <path d="M21.5 6.5H2.5C1.67 6.5 1 7.17 1 8v10.5c0 .83.67 1.5 1.5 1.5h19c.83 0 1.5-.67 1.5-1.5V8c0-.83-.67-1.5-1.5-1.5Z"/>
      <path d="M2.5 8.5h19V8c0-.55-.45-1-1-1H3.5c-.55 0-1 .45-1 1v.5Z" className="if-o1"/> {/* Top edge of body */}
      <path d="M1 9.5L12 6.5l11 3v8.5L12 21l-11-3V9.5Z" className="if-o3"/> {/* Front/back volume suggestion */}
      <path d="M21.5 19H2.5V8.5h19V19Z" className="if-o5" /> {/* Inner shadow */}
      <path d="M23 8L21.5 6.5H2.5L1 8v1.5h22V8Z" className="if-o5"/> {/* Top surface lighter facet */}
      <path d="M1 18.5V8l.75-1H22.25L23 8v10.5l-.75 1H1.75L1 18.5Z" className="if-o6" fillRule="evenodd"/>

      {/* Handle - More Solid and Faceted */}
      <path d="M16.5 6.5V4.5C16.5 3.4 15.6 2.5 14.5 2.5H9.5C8.4 2.5 7.5 3.4 7.5 4.5v2h1.5V4.5c0-.28.22-.5.5-.5h4c.28 0 .5.22.5.5v2h1.5Z"/>
      <path d="M14.5 2.5H9.5L12 1l2.5 1.5Z" className="if-o1"/> {/* Topmost facet of handle */}
      <path d="M15.5 6.5H8.5V4.5c0-.15.07-.28.18-.37L9.5 3.3h5l.82.83c.11.09.18.22.18.37V6.5Z" className="if-o2"/> {/* Handle front facet */}
      <path d="M9.5 3.3L7.5 4.5v2h1.5V4.5c0-.28.22-.5.5-.5h.5V3.3Z" className="if-o4" /> {/* Handle side L */}
      <path d="M14.5 3.3L16.5 4.5v2h-1.5V4.5c0-.28-.22-.5-.5-.5h-.5V3.3Z" className="if-o4" /> {/* Handle side R */}
    </IconBase>
  );
});
BriefcaseIcon.displayName = 'BriefcaseIcon';

export default BriefcaseIcon;
