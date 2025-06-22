
import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const FolderIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Main folder body */}
      <path d="M10 3H4.5C3.67 3 3 3.67 3 4.5v15c0 .83.67 1.5 1.5 1.5h15c.83 0 1.5-.67 1.5-1.5V7.5c0-.83-.67-1.5-1.5-1.5H12l-2-3z"/>
      {/* Front panel highlight (optional) */}
      <path d="M19.5 7.5H4.5V19.5h15V7.5zm-13-3H10l2 3h7.5V6H6.5z" opacity="0.4"/>
    </IconBase>
  );
});
FolderIcon.displayName = 'FolderIcon';

export default FolderIcon;
