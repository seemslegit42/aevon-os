import React from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const DNAStrandIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 1.5;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Helix 1 */}
      <path d="M8 3C4 7 4 17 8 21" fill="none" stroke="currentColor" strokeWidth={sw * 1.2} strokeLinecap="round" />
      <path d="M8 3C5 6 5 18 8 21" fill="none" stroke="currentColor" strokeWidth={sw * 0.6} strokeLinecap="round" opacity="0.6" />
      
      {/* Helix 2 */}
      <path d="M16 3c4 4 4 14 0 18" fill="none" stroke="currentColor" strokeWidth={sw * 1.2} strokeLinecap="round" />
      <path d="M16 3c3 3 3 15 0 18" fill="none" stroke="currentColor" strokeWidth={sw * 0.6} strokeLinecap="round" opacity="0.6" />

      {/* Connecting Rungs (Filled) */}
      <rect x="7.5" y="5" width="9" height="1.5" rx="0.5" opacity="0.8"/>
      <rect x="7" y="9" width="10" height="1.5" rx="0.5" opacity="0.8"/>
      <rect x="7" y="13" width="10" height="1.5" rx="0.5" opacity="0.8"/>
      <rect x="7.5" y="17" width="9" height="1.5" rx="0.5" opacity="0.8"/>
    </IconBase>
  );
};

export default DNAStrandIcon;
