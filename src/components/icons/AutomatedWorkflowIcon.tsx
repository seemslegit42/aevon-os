import React from 'react';
import IconBase, { ICON_GRADIENT_ID } from '../IconBase';
import { IconProps } from '../../types';

const AutomatedWorkflowIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 1.8;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline Automated Workflow Icon */}
      {/* Gear 1 (Top-Left) */}
      <path d="M8.5 4.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm.35 1.15l-.7.7-1.05-1.05.7-.7 1.05 1.05Zm-1.05 3.3l.7.7-1.05 1.05-.7-.7 1.05-1.05Zm1.75 1.4l.7-.7 1.05 1.05-.7.7-1.05-1.05Zm1.05-3.3l-.7-.7 1.05-1.05.7.7-1.05 1.05Z" transform="translate(-1,-1)"/>
      <path d="M8.5 4.5L7 6h3L8.5 4.5Z" opacity="0.6" transform="translate(-1,-1)"/>
      <circle cx="7.5" cy="7" r="1.5" opacity="0.4"/>

      {/* Gear 2 (Bottom-Right) */}
      <path d="M15.5 12.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm.35 1.15l-.7.7-1.05-1.05.7-.7 1.05 1.05Zm-1.05 3.3l.7.7-1.05 1.05-.7-.7 1.05-1.05Zm1.75 1.4l.7-.7 1.05 1.05-.7.7-1.05-1.05Zm1.05-3.3l-.7-.7 1.05-1.05.7.7-1.05 1.05Z" transform="translate(1,1)"/>
      <path d="M15.5 12.5L14 14h3l-1.5-1.5Z" opacity="0.6" transform="translate(1,1)"/>
      <circle cx="16.5" cy="15" r="1.5" opacity="0.4"/>
      
      {/* Flowing Arrow Pathway */}
      <path d="M8.5 10.5S10 12 12 12s3.5-1.5 3.5-1.5M14.5 12.5l1-1m-1 1l-1-1" 
            fill="none" stroke={`url(#${ICON_GRADIENT_ID})`} strokeWidth={sw * 0.8} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8.5 10.5L9 9l3 3-0.5 1.5-2.5-1.5Z" opacity="0.3" fill="currentColor"/>
       <path d="M13.5 10.5l1-1.5 1 1.5h-2Z" opacity="0.7"/> {/* Arrowhead */}
    </IconBase>
  );
};

export default AutomatedWorkflowIcon;
