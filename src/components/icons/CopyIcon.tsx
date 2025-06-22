import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const CopyIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Back Document */}
      <path d="M16 1.5H5c-1.1 0-2 .9-2 2V16h2V3.5h11V1.5Z" opacity="0.7"/>
      <path d="M16 1.5L5 3H3V16l2 1.5h11V1.5Z" opacity="0.4" />

      {/* Front Document */}
      <path d="M19 5H8c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2Z"/>
      <path d="M19 5L8 7v13l11-2V5Z" opacity="0.6"/>
    </IconBase>
  );
});
CopyIcon.displayName = 'CopyIcon';

export default CopyIcon;
