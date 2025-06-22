import React from 'react';
import IconBase, { ICON_GRADIENT_ID } from '../IconBase';
import { IconProps } from '../../types';

const MedicalImagingIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 1.8;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline Medical Imaging Icon */}
      {/* Outer Scan Area/Frame (Subtle) */}
      <rect x="2.5" y="2.5" width="19" height="19" rx="2" fill="currentColor" opacity="0.05"/>

      {/* Abstract Body Outline (e.g., Head/Torso slice - simplified) */}
      <path d="M12 5C9 5 6.5 7 6.5 10.5S9 19 12 19s5.5-3.5 5.5-8.5S15 5 12 5Z" opacity="0.5" fill="currentColor"/>
      <path d="M12 5L10 7h4L12 5Z" opacity="0.3"/>
      
      {/* Layered Scan Lines (Crystalline strokes) */}
      {/* Layer 1 */}
      <path d="M7.5 9h9" fill="none" stroke={`url(#${ICON_GRADIENT_ID})`} strokeWidth={sw * 0.6} strokeLinecap="round" opacity="0.8"/>
      {/* Layer 2 */}
      <path d="M7 12h10" fill="none" stroke={`url(#${ICON_GRADIENT_ID})`} strokeWidth={sw * 0.7} strokeLinecap="round" opacity="0.9"/>
      {/* Layer 3 */}
      <path d="M7.5 15h9" fill="none" stroke={`url(#${ICON_GRADIENT_ID})`} strokeWidth={sw * 0.6} strokeLinecap="round" opacity="0.8"/>

      {/* Internal "Structure" highlight (crystalline shape within the outline) */}
      <path d="M12 10l-1.5 2 1.5 2 1.5-2-1.5-2Z" fill="currentColor" opacity="0.7"/>
      <path d="M12 10L11 10.5l1 1.5 1-1.5-1-1Z" opacity="0.5"/>
    </IconBase>
  );
};

export default MedicalImagingIcon;
