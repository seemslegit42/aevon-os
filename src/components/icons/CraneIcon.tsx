import React from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const CraneIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Crystalline Crane Icon */}
      {/* Base/Tracks */}
      <path d="M3.5 18.5h17v3H3.5v-3Z"/>
      <path d="M3.5 18.5L12 17l8.5 1.5v3L12 23l-8.5-1.5v-3Z" opacity="0.6"/>
      <circle cx="6.5" cy="19.25" r="1" opacity="0.4"/>
      <circle cx="17.5" cy="19.25" r="1" opacity="0.4"/>

      {/* Tower/Mast */}
      <path d="M11 5.5h2v13h-2V5.5Z"/>
      <path d="M11 5.5L12 4.5l1 .5v13l-1 1-1-1V5.5Z" opacity="0.7"/>
      
      {/* Jib/Arm */}
      <path d="M21.5 5.5H12l-1.5 1.5h11L21.5 5.5Z"/>
      <path d="M12 5.5l9.5-1-1 2H12l-1.5-1.5 1.5.5Z" opacity="0.6"/>
      
      {/* Counterweight */}
      <path d="M6.5 5.5H11v3H6.5v-3Z"/>
      <path d="M6.5 5.5L8.75 4.5H11v3L8.75 9.5H6.5v-3Z" opacity="0.5"/>

      {/* Hook Line and Hook */}
      <path d="M18.5 7v5" strokeWidth={strokeWidth ? strokeWidth*0.5 : 1} stroke="currentColor" strokeLinecap="round" opacity="0.5"/>
      <path d="M17 13.5h3l-1.5 2.5L17 13.5Z" opacity="0.8"/>
      <path d="M17 13.5L18.5 12.5l1.5 1h-3Z" opacity="0.6"/>
    </IconBase>
  );
};

export default CraneIcon;
