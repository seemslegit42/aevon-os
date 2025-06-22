
import React from 'react';
import IconBase, { ICON_GRADIENT_ID } from '../IconBase';
import { IconProps } from '../../types';

const CRMIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 1.8;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline CRM Icon */}
      {/* Central User Icon */}
      <path d="M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z M12 14c-2.21 0-6.67 1.12-6.67 3.33V19h13.34v-1.67C18.67 15.12 14.21 14 12 14Z"/>
      <path d="M12 7L10.5 8.5l1.5 1.5 1.5-1.5L12 7Z" opacity="0.7"/> {/* Head facet */}
      <path d="M5.33 17.33L12 15l6.67 2.33V19H5.33v-1.67Z" opacity="0.5"/> {/* Body facet */}

      {/* Smaller Node Icons (Simplified user/dot) */}
      {/* Top-Left Node */}
      <circle cx="5" cy="6" r="2" opacity="0.8"/>
      <path d="M5 4L4 5l1 1 1-1-1-1Z" opacity="0.5"/>
      {/* Top-Right Node */}
      <circle cx="19" cy="6" r="2" opacity="0.8"/>
      <path d="M19 4L18 5l1 1 1-1-1-1Z" opacity="0.5"/>
      {/* Bottom-Left Node */}
      <circle cx="5" cy="18" r="2" opacity="0.8"/>
      <path d="M5 16L4 17l1 1 1-1-1-1Z" opacity="0.5"/>
      {/* Bottom-Right Node */}
      <circle cx="19" cy="18" r="2" opacity="0.8"/>
      <path d="M19 16L18 17l1 1 1-1-1-1Z" opacity="0.5"/>
      
      {/* Connecting Lines (Crystalline) */}
      <path d="M10.5 9.5L6.5 7.5M13.5 9.5L17.5 7.5M10.5 14.5L6.5 16.5M13.5 14.5L17.5 16.5" 
            fill="none" stroke={`url(#${ICON_GRADIENT_ID})`} strokeWidth={sw * 0.5} strokeLinecap="round" opacity="0.7"/>
      <path d="M10.5 9.5l-.5-.75L6.5 7.5l.25.5.5.25z M13.5 9.5l.5-.75L17.5 7.5l-.25.5-.5.25z" 
            fill="currentColor" opacity="0.3"/>
    </IconBase>
  );
};

export default CRMIcon;
