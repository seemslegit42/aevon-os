
import React from 'react';
import IconBase, { ICON_GRADIENT_ID } from '../IconBase';
import { IconProps } from '../../types';

const FirewallIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 1.8;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline Firewall Icon (Multi-layered Shield) */}
      {/* Outermost Shield Layer */}
      <path d="M12 2L2.5 5.5v7C2.5 18.5 6.5 22 12 22s9.5-3.5 9.5-9.5v-7L12 2Z"/>
      <path d="M12 2L2.5 5.5l9.5 3 9.5-3L12 2Z" opacity="0.6"/> {/* Top bevel */}
      
      {/* Middle Shield Layer (inset) */}
      <path d="M12 4.5L4.5 7.5v5.5c0 4.5 3.5 7.5 7.5 7.5s7.5-3 7.5-7.5V7.5L12 4.5Z" opacity="0.7"/>
      <path d="M12 4.5L4.5 7.5l7.5 2.5 7.5-2.5L12 4.5Z" opacity="0.4"/>
      
      {/* Innermost Core/Shield Layer */}
      <path d="M12 7L6.5 9.5v3.5c0 2.5 2.5 4.5 5.5 4.5s5.5-2 5.5-4.5V9.5L12 7Z" opacity="0.5"/>
      <path d="M12 7L6.5 9.5l5.5 1.5 5.5-1.5L12 7Z" opacity="0.3"/>

      {/* Dynamic Energy Patterns/Lines (subtle crystalline strokes) */}
      <path d="M5 9s1.5 1.5 3.5 0 M19 9s-1.5 1.5-3.5 0 M8.5 15s1 -1.5 3.5 -1.5s2.5 1.5 3.5 1.5" 
            fill="none" stroke={`url(#${ICON_GRADIENT_ID})`} strokeWidth={sw * 0.3} strokeLinecap="round" opacity="0.3"/>
      <path d="M12 19l-2-2.5M12 19l2-2.5" 
            fill="none" stroke={`url(#${ICON_GRADIENT_ID})`} strokeWidth={sw * 0.25} strokeLinecap="round" opacity="0.2"/>
    </IconBase>
  );
};

export default FirewallIcon;
