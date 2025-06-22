
import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const UserIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Simplified user/profile silhouette */}
      <path d="M12 6a3.5 3.5 0 100 7 3.5 3.5 0 000-7zM12 14c-3.86 0-7 1.57-7 3.5V19h14v-1.5c0-1.93-3.14-3.5-7-3.5z"/>
      {/* Subtle highlight for head (optional) */}
      <path d="M12 6a3.5 3.5 0 00-2.5 1.03L12 11l2.5-3.97A3.5 3.5 0 0012 6z" opacity="0.5"/>
    </IconBase>
  );
});
UserIcon.displayName = 'UserIcon';

export default UserIcon;
