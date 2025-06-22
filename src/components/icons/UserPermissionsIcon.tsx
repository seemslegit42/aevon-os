import React from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const UserPermissionsIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 1.8;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline User Permissions Icon */}
      {/* User Silhouette Base */}
      <path d="M12 6a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z M12 14c-2.92 0-8.75 1.46-8.75 4.38V21h17.5v-2.62C20.75 15.46 14.92 14 12 14Z" opacity="0.8"/>
      <path d="M12 6L10 8h4L12 6Z" opacity="0.6"/>
      <path d="M3.25 18.38L12 15l8.75 3.38V21H3.25v-2.62Z" opacity="0.4"/>

      {/* Crystalline Key Emblem (Overlay or beside user) */}
      {/* Key Head */}
      <path d="M19 5.5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z" transform="translate(0.5, 9.5) scale(0.9)"/>
      <path d="M16.5 13a2.5 2.5 0 0 0-1.77 4.27L16.5 18l1.77-1.77A2.5 2.5 0 0 0 16.5 13Z" transform="translate(0.5, 0) scale(0.9)" opacity="0.6"/>
      {/* Key Shaft & Teeth */}
      <path d="M16.5 10v4.5M15 12h-1M15 13.5h-1.5" stroke="currentColor" strokeWidth={sw*0.4} strokeLinecap="round" opacity="0.7" transform="translate(0.5, 0) scale(0.9)"/>
      <path d="M16.5 10L15.75 9.5l.75-.75.75.75-.75.75Z" opacity="0.5" transform="translate(0.5, 0) scale(0.9)"/>
    </IconBase>
  );
};

export default UserPermissionsIcon;
