import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const PhoneIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Main Handset Shape */}
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
      {/* Highlights for 3D effect */}
      <path d="M6.62 10.79L4 13.41c0-1.45.32-2.83.89-4.11L6.62 10.79z" opacity="0.5"/>
      <path d="M19.59 17.38c-1.28.57-2.66.89-4.11.89L17.38 16.6l2.2-2.2c.37-1.12.57-2.33.57-3.57V7.5h-.01c.08.19.15.39.2.59l-2.2 2.2.01.01.01.01 2.2 2.2c.27.27.36.67.24 1.02-.37 1.12-.57 2.33-.57 3.57z" opacity="0.4"/>
    </IconBase>
  );
});
PhoneIcon.displayName = 'PhoneIcon';

export default PhoneIcon;
