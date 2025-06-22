import React from 'react';
import IconBase, { ICON_GRADIENT_ID } from '../IconBase';
import { IconProps } from '../../types';

const AIEthicsIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 1.8;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline AI Ethics Icon (Shield with Neural Pattern) */}
      {/* Main shield body */}
      <path d="M12 2.5L3.5 6.25v6.5C3.5 18.25 7.25 22.5 12 22.5s8.5-4.25 8.5-9.75v-6.5L12 2.5Z"/>
      
      {/* Shield Facets */}
      <path d="M12 2.5L3.5 6.25l8.5 2.5 8.5-2.5L12 2.5Z" opacity="0.6"/> {/* Top bevel */}
      <path d="M12 22.5C7.25 22.5 3.5 18.25 3.5 12.75V6.25L12 9.5v13Z" opacity="0.4"/> {/* Left side highlight */}
      <path d="M12 22.5C16.75 22.5 20.5 18.25 20.5 12.75V6.25L12 9.5v13Z" opacity="0.5"/> {/* Right side highlight */}

      {/* Neural Network Pattern (Subtle, on shield surface) */}
      {/* Central Node */}
      <circle cx="12" cy="11.5" r="1.5" fill="currentColor" opacity="0.3"/>
      {/* Connecting Nodes/Lines */}
      <path d="M12 11.5L9.5 8.5M12 11.5L14.5 8.5M12 11.5L9.5 14.5M12 11.5L14.5 14.5M9.5 8.5L7 11.5M14.5 8.5L17 11.5" 
            strokeWidth={sw * 0.3} strokeLinecap="round" stroke="currentColor" opacity="0.25" fill="none"/>
      <circle cx="9.5" cy="8.5" r="0.75" fill="currentColor" opacity="0.2"/>
      <circle cx="14.5" cy="8.5" r="0.75" fill="currentColor" opacity="0.2"/>
      <circle cx="9.5" cy="14.5" r="0.75" fill="currentColor" opacity="0.2"/>
      <circle cx="14.5" cy="14.5" r="0.75" fill="currentColor" opacity="0.2"/>
    </IconBase>
  );
};

export default AIEthicsIcon;
