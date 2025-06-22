
import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const PrintIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Printer Body Top */}
      <path d="M19 7H5c-1.1 0-2 .9-2 2v6h4v-2h10v2h4V9c0-1.1-.9-2-2-2Z" />
      <path d="M19 7L5 8.5H3V15h2.5v-1.5h13V15H21V9L19 7Z" opacity="0.6" />
      
      {/* Paper Coming Out */}
      <path d="M18 13H6v6h12v-6Z" opacity="0.8" />
      <path d="M6 13L12 12l6 1v6l-6 1-6-1v-6Z" opacity="0.5"/>
      
      {/* Paper Input Slot / Top Paper */}
      <path d="M17 1.5H7v5h10v-5Z" opacity="0.7" />
      <path d="M7 1.5L12 .5l5 1v5l-5 1-5-1v-5Z" opacity="0.4" />
    </IconBase>
  );
});
PrintIcon.displayName = 'PrintIcon';

export default PrintIcon;
