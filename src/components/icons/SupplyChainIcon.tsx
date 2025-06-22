import React from 'react';
import IconBase, { ICON_GRADIENT_ID } from '../IconBase';
import { IconProps } from '../../types';

const SupplyChainIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 1.8;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline Supply Chain Icon */}
      {/* Box 1 (Left) */}
      <path d="M2 9h5v5H2V9Z M2 9L4.5 7.5 7 9v5L4.5 15.5 2 14V9Z" opacity="0.9"/>
      <path d="M4.5 7.5L2 9h5L4.5 7.5Z" opacity="0.6"/>

      {/* Box 2 (Center) */}
      <path d="M9.5 9h5v5h-5V9Z M9.5 9L12 7.5l2.5 1.5v5L12 15.5l-2.5-1.5V9Z" />
      <path d="M12 7.5L9.5 9h5L12 7.5Z" opacity="0.6"/>

      {/* Box 3 (Right) */}
      <path d="M17 9h5v5h-5V9Z M17 9L19.5 7.5 22 9v5L19.5 15.5 17 14V9Z" opacity="0.9"/>
      <path d="M19.5 7.5L17 9h5L19.5 7.5Z" opacity="0.6"/>

      {/* Connecting Arrows (Crystalline strokes) */}
      {/* Arrow 1 (Left to Center) */}
      <path d="M7 11.5h2.5M8.5 10l1 1.5-1 1.5" 
            fill="none" stroke={`url(#${ICON_GRADIENT_ID})`} strokeWidth={sw * 0.7} strokeLinecap="round" strokeLinejoin="round" opacity="0.8"/>
      <path d="M8.5 10l.5-.25 1 1.5-.25.25.25.25-1 1.5-.5-.25-.25-.25 1-1.5.25-.25z" fill="currentColor" opacity="0.4"/>
      
      {/* Arrow 2 (Center to Right) */}
      <path d="M14.5 11.5h2.5M16 10l1 1.5-1 1.5" 
            fill="none" stroke={`url(#${ICON_GRADIENT_ID})`} strokeWidth={sw * 0.7} strokeLinecap="round" strokeLinejoin="round" opacity="0.8"/>
      <path d="M16 10l.5-.25 1 1.5-.25.25.25.25-1 1.5-.5-.25-.25-.25 1-1.5.25-.25z" fill="currentColor" opacity="0.4"/>

      {/* Base Line (Subtle) */}
      <path d="M1 16h22v1H1z" opacity="0.15"/>
    </IconBase>
  );
};

export default SupplyChainIcon;
