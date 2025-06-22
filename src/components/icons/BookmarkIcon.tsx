import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const BookmarkIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Main ribbon shape - More Defined Folds */}
      <path d="M17.5 1.5H6.5C5.4 1.5 4.5 2.4 4.5 3.5v17a1.5 1.5 0 0 0 2.37 1.2L12 18.15l5.13 3.55A1.5 1.5 0 0 0 19.5 20.5V3.5c0-1.1-.9-2-2-2Z"/>
      
      {/* Center fold facet - More pronounced */}
      <path d="M12 3.5v14.65L6.5 14V3.5h5.5Z" className="if-o1"/>
      <path d="M12 3.5v14.65L17.5 14V3.5h-5.5Z" className="if-o2"/>
      
      {/* Top edge facet - Crisper */}
      <path d="M17.5 1.5H6.5L7.5 3h9L17.5 1.5Z" className="if-o1"/>
      <path d="M6.5 1.5L12 .5l5.5 1H6.5Z" className="if-o5"/>
      
      {/* Bottom V-cut facet - Sharper and More 3D */}
      <path d="M12 18.15l-5.13 3.55.88-.6L12 18.15Z" className="if-o2"/>
      <path d="M12 18.15l5.13 3.55-.88-.6L12 18.15Z" className="if-o3"/>
      <path d="M6.87 21.7L12 18.15l5.13 3.55.63-.85L12 17l-5.75 3.85.62.85Z" className="if-o4"/>
      <path d="M12 18.15L4.5 20.5V3.5l7.5 2v12.65Z" className="if-o6" fillRule="evenodd"/>
      
      {/* Facet along the "spine" */}
      <path d="M12 3.5L11 18.15l1 .85 1-.85L12 3.5Z" className="if-o6" />
    </IconBase>
  );
});
BookmarkIcon.displayName = 'BookmarkIcon';

export default BookmarkIcon;
