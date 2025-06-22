import React from 'react';
import IconBase, { ICON_GRADIENT_ID } from '../IconBase';
import { IconProps } from '../../types';

const ECommercePlatformIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 1.7;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline E-Commerce Platform Icon */}
      {/* Storefront/Cart Hybrid */}
      {/* Awning/Roof */}
      <path d="M3 7l9-4 9 4v2H3V7Z"/>
      <path d="M3 7L12 3l9 4-1 1H4L3 7Z" opacity="0.7"/>
      {/* Main Body/Basket */}
      <path d="M4.5 9.5h15l-1.5 7H6L4.5 9.5Z"/>
      <path d="M4.5 9.5L12 8l7.5 1.5-1.5 7L12 18l-6-1.5-1.5-7Z" opacity="0.5"/>
      {/* Wheels */}
      <circle cx="7.5" cy="18.5" r="1.5" opacity="0.8"/>
      <circle cx="16.5" cy="18.5" r="1.5" opacity="0.8"/>
      <path d="M7.5 17a1.5 1.5 0 0 0-1.06 2.56L7.5 20l1.06-1.06A1.5 1.5 0 0 0 7.5 17Z" opacity="0.4"/>

      {/* Network Nodes/Connections (Suggesting Platform Aspect) */}
      {/* Node 1 (Top-Left) */}
      <circle cx="3.5" cy="4.5" r="1.5" fill="currentColor" opacity="0.6"/>
      {/* Node 2 (Top-Right) */}
      <circle cx="20.5" cy="4.5" r="1.5" fill="currentColor" opacity="0.6"/>
      {/* Node 3 (Bottom-Center) */}
      <circle cx="12" cy="21" r="1.5" fill="currentColor" opacity="0.6"/>

      {/* Connecting Lines */}
      <path d="M4.5 5.5L11 8M19.5 5.5L13 8M12 19.5L8.5 17M12 19.5L15.5 17"
            fill="none" stroke={`url(#${ICON_GRADIENT_ID})`} strokeWidth={sw * 0.4} strokeLinecap="round" opacity="0.5"/>
    </IconBase>
  );
};

export default ECommercePlatformIcon;
