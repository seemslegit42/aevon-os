import React from 'react';
import IconBase, { ICON_GRADIENT_ID } from '../IconBase';
import { IconProps } from '../../types';

const AICollaborationIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 1.8;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline AI Collaboration Icon */}
      {/* Agent Head 1 (Central Top) */}
      <path d="M12 2.5a4 4 0 0 0-3.87 3L12 9.38l3.87-3.88A4 4 0 0 0 12 2.5Z" />
      <path d="M8.13 5.5L12 9.38V12l-5-3c0-1.5.8-2.83 2.13-3.5Z" opacity="0.7"/>
      <path d="M15.87 5.5L12 9.38V12l5-3c0-1.5-.8-2.83-2.13-3.5Z" opacity="0.7"/>
      
      {/* Agent Head 2 (Bottom Left) */}
      <path d="M6 12.5a3.5 3.5 0 0 0-3.38 2.63L6 18.38l3.38-3.25A3.5 3.5 0 0 0 6 12.5Z" transform="translate(-0.5, 1)"/>
      <path d="M2.62 15.13L6 18.38v2.12l-4-2.5c0-1.25.7-2.33 1.62-3Z" opacity="0.6" transform="translate(-0.5, 1)"/>

      {/* Agent Head 3 (Bottom Right) */}
      <path d="M18 12.5a3.5 3.5 0 0 0-3.38 2.63L18 18.38l3.38-3.25A3.5 3.5 0 0 0 18 12.5Z" transform="translate(0.5, 1)"/>
      <path d="M14.62 15.13L18 18.38v2.12l4-2.5c0-1.25-.7-2.33-1.62-3Z" opacity="0.6" transform="translate(0.5, 1)"/>

      {/* Connecting Beams/Lines */}
      <path d="M12 9.38L7.5 14M12 9.38L16.5 14M9 16.5h6"
            fill="none" stroke={`url(#${ICON_GRADIENT_ID})`} strokeWidth={sw * 0.6} strokeLinecap="round" opacity="0.5"/>
      <path d="M12 9.38l-1-1.5L7.5 14l.75.75L12 9.38z M12 9.38l1-1.5L16.5 14l-.75.75L12 9.38z"
            fill="currentColor" opacity="0.2"/>
    </IconBase>
  );
};

export default AICollaborationIcon;
