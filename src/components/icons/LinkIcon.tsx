
import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const LinkIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* First Link - More Solid and Faceted */}
      <path d="M10 13.5A6.5 6.5 0 0 0 10 1L8.25 2.75a6.5 6.5 0 1 0-8.5 8.5L1.5 13A6.5 6.5 0 0 0 10 13.5ZM2.75 4.75a4.5 4.5 0 0 1 6.36 0l1.77 1.77a4.5 4.5 0 0 1 0 6.36 4.5 4.5 0 0 1-6.36 0L2.75 11.11a4.5 4.5 0 0 1 0-6.36Z"/>
      <path d="M8.75 4.25L6.5 6.5l5.65 5.65 2.25-2.25-5.65-5.65Z" className="if-o1"/> {/* Top surface facet */}
      <path d="M2.75 6.5l-1.5-1.5L4.5 1.75l1.5 1.5-3.25 3.25Zm6.36 6.36l1.5 1.5 2.25-2.25-1.5-1.5-2.25 2.25Z" className="if-o2"/> {/* Side facets */}
      <path d="M10 13.5L8.25 2.75l-1.5 1.5L8.5 15l1.5-1.5Z" className="if-o4"/> {/* Edge highlight */}
      <path d="M10 1L1 10l1.75 1.75L10 2.75V1Z" className="if-o6"/> {/* Underside shadow */}

      {/* Second Link - More Solid and Faceted */}
      <path d="M21.25 5.75a6.5 6.5 0 0 0-9.19 0L10.29 7.5a6.5 6.5 0 0 0 0 9.19 6.5 6.5 0 0 0 9.19 0l1.77-1.77a6.5 6.5 0 0 0 0-9.19ZM12.79 20.21a4.5 4.5 0 0 1-6.36 0l-1.77-1.77a4.5 4.5 0 0 1 0-6.36 4.5 4.5 0 0 1 6.36 0l1.77 1.77a4.5 4.5 0 0 1 0 6.36Z"/>
      <path d="M19.75 7.5L21.25 5.75l-5.66-5.66-2.25 2.25 5.66 5.66Z" className="if-o1"/> {/* Top surface facet */}
      <path d="M21.25 9.19l1.5-1.5L19.5 4.44l-1.5 1.5 3.25 3.25Zm-6.36-6.36l-1.5-1.5-2.25 2.25 1.5 1.5 2.25-2.25Z" className="if-o2"/> {/* Side facets */}
      <path d="M14 10.5l1.77 10.76 1.5-1.5L15.5 9l-1.5 1.5Z" className="if-o4"/> {/* Edge highlight */}
      <path d="M14 23l10-10-1.75-1.75L14 21.25V23Z" className="if-o6"/> {/* Underside shadow */}
    </IconBase>
  );
});
LinkIcon.displayName = 'LinkIcon';

export default LinkIcon;
