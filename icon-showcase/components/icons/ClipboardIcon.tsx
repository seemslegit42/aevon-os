
import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const ClipboardIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Board - More Defined Thickness */}
      <path d="M19.5 3.5H16V2.25C16 1.28 15.22.5 14.25.5h-4.5C8.78.5 8 1.28 8 2.25V3.5H4.5C3.4.5 2.5 1.4 2.5 2.5v17C2.5 20.6 3.4 21.5 4.5 21.5h15c1.1 0 2-.9 2-2V5.5c0-1.1-.9-2-2-2Z"/>
      <path d="M4.5 5.5h15V4.5c0-.55-.45-1-1-1H5.5c-.55 0-1 .45-1 1v1Z" className="if-o1"/> {/* Top edge of board */}
      <path d="M2.5 6.5L12 4l9.5 2.5V19L12 21.5l-9.5-2.5V6.5Z" className="if-o3"/> {/* Board front/back volume */}
      <path d="M19.5 20H4.5V5.5h15V20Z" className="if-o5" /> {/* Inner shadow */}
      <path d="M16 3.5H8V2.25c0-.14.11-.25.25-.25h7.5c.14 0 .25.11.25.25V3.5Z" className="if-o5"/> {/* Clip top surface */}
      <path d="M2.5 19.5V5.5l1-1.5H20.5l1 1.5v14l-1 1.5H3.5L2.5 19.5Z" className="if-o6" fillRule="evenodd"/>

      {/* Clip Mechanism - More 3D and Faceted */}
      <path d="M15 3.5H9V2.25c0-.41.34-.75.75-.75h4.5c.41 0 .75.34.75.75V3.5Z"/>
      <path d="M14.25.5h-4.5L12 0l2.25.5Z" className="if-o1"/> {/* Topmost facet of clip */}
      <path d="M16 .5H8v1.75C8 .78 8.78 0 9.75 0h4.5c.97 0 1.75.78 1.75 1.75V3.5H8V2.25h8V3.5h-2.25V2.25C13.75 1.28 15.22.5 14.25.5Z" className="if-o2"/> {/* Clip front facet */}
      <path d="M9 .5L8 2.25V3.5h1V2.25C9 1.67 8.58.5 9 .5Z" className="if-o4"/> {/* Clip side L */}
      <path d="M15 .5L16 2.25V3.5h-1V2.25C15 1.67 15.42.5 15 .5Z" className="if-o4"/> {/* Clip side R */}
    </IconBase>
  );
});
ClipboardIcon.displayName = 'ClipboardIcon';

export default ClipboardIcon;
