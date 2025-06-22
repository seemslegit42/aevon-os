
import React, { forwardRef } from 'react';
import IconBase, { ICON_GRADIENT_ID } from '../IconBase';
import { IconProps } from '../../types';

const SettingsIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Simplified gear shape */}
      <path d="M19.43 12.97a8.027 8.027 0 00-.34-1.94l1.55-1.27a.5.5 0 00.1-.7l-1.9-3.46a.5.5 0 00-.61-.22l-1.89.76a8.032 8.032 0 00-1.64-.94L14.05 2.7c-.04-.26-.26-.45-.52-.45h-3.06c-.26 0-.48.19-.52.45l-.6 2.54a8.032 8.032 0 00-1.64.94l-1.89-.76a.5.5 0 00-.61.22l-1.9 3.46a.5.5 0 00.1.7l1.55 1.27a8.027 8.027 0 00-.34 1.94c0 .33.03.65.07.97l-1.55 1.27a.5.5 0 00-.1.7l1.9 3.46c.07.13.2.22.34.25s.29.01.4-.06l1.89-.76c.49.4.99.73 1.55.97l.6 2.54c.04.26.26.45.52.45h3.06c.26 0 .48.19.52.45l.6-2.54a8.032 8.032 0 001.64-.94l1.89.76c.11.04.24.05.34.01s.24-.12.31-.25l1.9-3.46a.5.5 0 00-.1-.7l-1.55-1.27c.04-.32.07-.64.07-.97zM12 15.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z" fill={`url(#${ICON_GRADIENT_ID})`} />
      {/* Central hub highlight */}
      <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.7"/>
    </IconBase>
  );
});
SettingsIcon.displayName = 'SettingsIcon';

export default SettingsIcon;
