
import React from 'react';
import IconBase, { ICON_GRADIENT_ID } from '../IconBase';
import { IconProps } from '../../types';

const BlueprintIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 1.8;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline Blueprint Icon (Rolled Plan) */}
      {/* Rolled paper main body */}
      <path d="M20.5 6.5C20.5 4.01 18.49 2 16 2H8C5.51 2 3.5 4.01 3.5 6.5V17.5c0 1.1.9 2 2 2h1c0-1.1.9-2 2-2s2 .9 2 2h2c0-1.1.9-2 2-2s2 .9 2 2h1c1.1 0 2-.9 2-2V6.5Z"/>
      
      {/* Edge of the roll / top surface */}
      <path d="M16 2H8C6.34 2 5 3.12 4.56 4.5h14.88C19 3.12 17.66 2 16 2Z" opacity="0.7"/>
      <path d="M20.5 6.5V5c-1-1.5-3-2.5-4.5-2.5H8C6.5 2.5 4.5 3.5 3.5 5v1.5C3.5 5.17 4.67 4 6 4h12c1.33 0 2.5 1.17 2.5 2.5Z" opacity="0.5"/>

      {/* Abstracted lines on blueprint (using stroke with gradient) */}
      <path d="M7 7.5h10M7 10.5h6M7 13.5h10" 
            fill="none" stroke={`url(#${ICON_GRADIENT_ID})`} strokeWidth={sw * 0.5} strokeLinecap="round" opacity="0.6"/>
      <path d="M9.5 7.5V13.5 M13.5 7.5V10.5" 
            fill="none" stroke={`url(#${ICON_GRADIENT_ID})`} strokeWidth={sw * 0.4} strokeLinecap="round" opacity="0.5"/>

      {/* Tie/Band around the roll (filled) */}
      <path d="M13 17.5H11c-.55 0-1 .45-1 1s.45 1 1 1h2c.55 0 1-.45 1-1s-.45-1-1-1Z" opacity="0.8"/>
      <path d="M11 17.5L12 17l1 .5v2l-1 .5-1-.5v-2Z" opacity="0.6"/>
    </IconBase>
  );
};

export default BlueprintIcon;
