import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const EyeIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Main eye shape */}
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5zm0 10.5c-2.48 0-4.5-2.02-4.5-4.5S9.52 6 12 6s4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5z"/>
      {/* Pupil */}
      <circle cx="12" cy="12" r="2.5" opacity="0.9"/>
      {/* Iris highlight */}
      <path d="M12 6c-2.48 0-4.5 2.02-4.5 4.5h1.5c0-1.65 1.35-3 3-3s3 1.35 3 3h1.5c0-2.48-2.02-4.5-4.5-4.5z" opacity="0.4"/>
    </IconBase>
  );
});
EyeIcon.displayName = 'EyeIcon';

export default EyeIcon;
