
import React from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const RXPharmaIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 2;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline RX Pharma Icon (Rx Symbol Focus) */}
      {/* R part of Rx */}
      <path d="M9.5 5.5h4a3 3 0 0 1 0 6H11v2H9.5V5.5Zm1.5 1.5v3h2a1.5 1.5 0 0 0 0-3h-2Z"/>
      <path d="M9.5 5.5L11.75 4L14 5.5v6L11.75 13L11 11.5v-6Z" opacity="0.7"/>
      
      {/* X part of Rx (crossing R's leg) */}
      <path d="M11 11.5l4.5 4.5m-4.5 0l4.5-4.5"/>
      <path d="M11 11.5l-.75-.75 4.5 4.5.75.75-4.5-4.5Z" opacity="0.6" fill="currentColor"/>
      <path d="M11 16l-.75.75 4.5-4.5.75-.75-4.5 4.5Z" opacity="0.6" fill="currentColor"/>

      {/* Outline/Container (subtle shield/badge shape) */}
      <path d="M12 2C6.5 2 3 5.5 3 10v4c0 4.5 3.5 8 9 8s9-3.5 9-8v-4c0-4.5-3.5-8-9-8Zm7.5 14c0 3-2.5 5.5-6.5 5.5S5.5 19 5.5 16v-3h13v3Z" opacity="0.15"/>
    </IconBase>
  );
};

export default RXPharmaIcon;
