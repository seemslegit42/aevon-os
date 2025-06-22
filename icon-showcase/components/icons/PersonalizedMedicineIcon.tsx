
import React from 'react';
import IconBase, { ICON_GRADIENT_ID } from '../IconBase';
import { IconProps } from '../../types';

const PersonalizedMedicineIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 1.6;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline Personalized Medicine Icon */}
      {/* Abstract User Profile Silhouette (Left Side) */}
      <path d="M9 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z M9 13c-2.5 0-6 1.25-6 3.75V19h7.5c-1.5-1-2.6-2.5-3-4.25-.5-.2-.75-.5-.75-.75Z" opacity="0.7"/>
      <path d="M9 6L7.5 7.5l1.5 1.5L10.5 7.5 9 6Z" opacity="0.5"/> {/* Head facet */}
      <path d="M3 16.75L9 14l3 2.75V19H3v-2.25Z" opacity="0.3"/> {/* Body facet */}

      {/* DNA Strand (Right Side, intertwining) - Simplified */}
      {/* Helix 1 */}
      <path d="M14 4c-2 3-2 7 0 10s2 5 0 5" fill="none" stroke={`url(#${ICON_GRADIENT_ID})`} strokeWidth={sw} strokeLinecap="round" />
      <path d="M14 4L13.25 5c-1.5 2.5-1.5 6 0 8.5L14 14" fill="none" stroke={`url(#${ICON_GRADIENT_ID})`} strokeWidth={sw*0.6} strokeLinecap="round" opacity="0.6" />
      
      {/* Helix 2 */}
      <path d="M18 4c2 3 2 7 0 10s-2 5 0 5" fill="none" stroke={`url(#${ICON_GRADIENT_ID})`} strokeWidth={sw} strokeLinecap="round" />
      <path d="M18 4L18.75 5c1.5 2.5 1.5 6 0 8.5L18 14" fill="none" stroke={`url(#${ICON_GRADIENT_ID})`} strokeWidth={sw*0.6} strokeLinecap="round" opacity="0.6" />

      {/* Connecting Rungs (crossing the user profile slightly) */}
      <path d="M10.5 7h6M9.5 11h7M10.5 15h6" opacity="0.8" fill="currentColor"/>
      <path d="M10.5 6.5l.75-.25h6l.75.25-.75.25h-6L10.5 6.5Z" opacity="0.5"/>
      <path d="M9.5 10.5l.75-.25h7l.75.25-.75.25h-7L9.5 10.5Z" opacity="0.5"/>
      <path d="M10.5 14.5l.75-.25h6l.75.25-.75.25h-6L10.5 14.5Z" opacity="0.5"/>
    </IconBase>
  );
};

export default PersonalizedMedicineIcon;
