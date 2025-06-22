import React from 'react';
import IconBase, { ICON_GRADIENT_ID } from '../IconBase';
import { IconProps } from '../../types';

const HeartbeatLineIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 2.2;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Main Path for the ECG line */}
      <path d="M2 12h3l2-7 3.5 10 2.5-7 2.5 5H22" 
            fill="none" 
            stroke={`url(#${ICON_GRADIENT_ID})`} 
            strokeWidth={sw * 1} 
            strokeLinecap="round" 
            strokeLinejoin="round"/>
      {/* Facet effect under the line to give it thickness/body */}
      <path d="M2 12.5h2.5l2-7L9 15l3.5-10L15 13l2-5h4.5" 
            fill="none" 
            stroke={`url(#${ICON_GRADIENT_ID})`} 
            strokeWidth={sw * 0.5} 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            opacity="0.5"/>
    </IconBase>
  );
};

export default HeartbeatLineIcon;
