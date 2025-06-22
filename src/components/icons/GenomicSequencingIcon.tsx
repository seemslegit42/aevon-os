import React from 'react';
import IconBase, { ICON_GRADIENT_ID } from '../IconBase';
import { IconProps } from '../../types';

const GenomicSequencingIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 1.6;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline Genomic Sequencing Icon */}
      {/* DNA Helix 1 */}
      <path d="M6 3c-4 5-2 12 2 15s5 4 4 0" 
            fill="none" stroke={`url(#${ICON_GRADIENT_ID})`} strokeWidth={sw * 1.1} strokeLinecap="round"/>
      <path d="M6 3L5 4c-3 4-1.5 10 2 12.5l1 1" 
            fill="none" stroke={`url(#${ICON_GRADIENT_ID})`} strokeWidth={sw * 0.7} strokeLinecap="round" opacity="0.6"/>
      
      {/* DNA Helix 2 */}
      <path d="M18 3c4 5 2 12-2 15s-5 4-4 0"
            fill="none" stroke={`url(#${ICON_GRADIENT_ID})`} strokeWidth={sw * 1.1} strokeLinecap="round"/>
      <path d="M18 3L19 4c3 4 1.5 10-2 12.5l-1 1"
            fill="none" stroke={`url(#${ICON_GRADIENT_ID})`} strokeWidth={sw * 0.7} strokeLinecap="round" opacity="0.6"/>

      {/* Connecting Rungs with Data Points (Crystalline dots/bars) */}
      {/* Rung 1 */}
      <line x1="7.5" y1="5.5" x2="16.5" y2="5.5" stroke="currentColor" strokeWidth={sw*0.4} opacity="0.5"/>
      <circle cx="8" cy="5.5" r="0.75" fill="currentColor" opacity="0.9"/>
      <rect x="11.5" y="5" width="1" height="1" fill="currentColor" opacity="0.9"/>
      <circle cx="16" cy="5.5" r="0.75" fill="currentColor" opacity="0.9"/>
      {/* Rung 2 */}
      <line x1="7" y1="9.5" x2="17" y2="9.5" stroke="currentColor" strokeWidth={sw*0.4} opacity="0.5"/>
      <rect x="7.5" y="9" width="1" height="1" fill="currentColor" opacity="0.9"/>
      <circle cx="12" cy="9.5" r="0.75" fill="currentColor" opacity="0.9"/>
      <rect x="15.5" y="9" width="1" height="1" fill="currentColor" opacity="0.9"/>
      {/* Rung 3 */}
      <line x1="7.5" y1="13.5" x2="16.5" y2="13.5" stroke="currentColor" strokeWidth={sw*0.4} opacity="0.5"/>
      <circle cx="8" cy="13.5" r="0.75" fill="currentColor" opacity="0.9"/>
      <rect x="11.5" y="13" width="1" height="1" fill="currentColor" opacity="0.9"/>
      <circle cx="16" cy="13.5" r="0.75" fill="currentColor" opacity="0.9"/>
       {/* Rung 4 */}
      <line x1="9" y1="17.5" x2="15" y2="17.5" stroke="currentColor" strokeWidth={sw*0.4} opacity="0.5"/>
      <rect x="9.5" y="17" width="1" height="1" fill="currentColor" opacity="0.9"/>
      <circle cx="12" cy="17.5" r="0.75" fill="currentColor" opacity="0.9"/>
    </IconBase>
  );
};

export default GenomicSequencingIcon;
