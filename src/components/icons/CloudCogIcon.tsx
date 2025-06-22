
import React from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const CloudCogIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 1.8;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline Cloud Cog Icon */}
      {/* Cloud Shape */}
      <path d="M18 9.5a5.5 5.5 0 0 0-10.4-2.45A6.5 6.5 0 0 0 7 19.5h11.5c2.21 0 4-1.79 4-4a4.5 4.5 0 0 0-4-4.5Z"/>
      <path d="M7.6 7.05L12 3l5 4.05v.2c0 2-1 3-2.5 3h-5c-1.5 0-2.5-1-2.5-3v-.2Z" opacity="0.6"/>
      
      {/* Cog/Gear Shape (Embedded within cloud) */}
      <path d="M12 12.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0-1.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" transform="translate(0, 5)"/>
      <path d="M12 11.5l-.7.7-1.05-1.05.7-.7 1.05 1.05Zm-1.05 3.3l.7.7-1.05 1.05-.7-.7 1.05-1.05Zm1.75 1.4l.7-.7 1.05 1.05-.7.7-1.05-1.05Zm1.05-3.3l-.7-.7 1.05-1.05.7.7-1.05 1.05Z" transform="translate(0, 5)" opacity="0.8"/>
      <path d="M12 9.5L10.5 11h3L12 9.5Z" transform="translate(0, 5)" opacity="0.5"/>
    </IconBase>
  );
};

export default CloudCogIcon;
