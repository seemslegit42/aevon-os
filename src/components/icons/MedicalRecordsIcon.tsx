
import React from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const MedicalRecordsIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 1.8;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline Medical Records Icon */}
      {/* Folder Base */}
      <path d="M10 3H4.5C3.67 3 3 3.67 3 4.5v15c0 .83.67 1.5 1.5 1.5h15c.83 0 1.5-.67 1.5-1.5V9.5c0-.83-.67-1.5-1.5-1.5H12l-2-3Z"/>
      <path d="M10 3L3 5.25v13.5L4.5 21h15L21 18.75V9.5L19.5 8H12l-2-3Z" opacity="0.5"/> {/* Folder bevel */}
      <path d="M4.5 5h4.88L11.25 7H19v11.5H4.5V5Z" opacity="0.2"/> {/* Inner area shadow */}
      
      {/* Caduceus/Medical Emblem (Simplified, crystalline) on folder tab */}
      {/* Staff */}
      <path d="M14.5 4.5v3M14.125 4.5L14.5 4l.375.5v3l-.375.5L14.5 8v-3Z" opacity="0.8" transform="scale(0.8) translate(3.5, 0.5)"/>
      {/* Simplified Wings/Serpent */}
      <path d="M13 5.5s.5-.5 1.5-.5 1 .5 1 .5M16 5.5s-.5.5-1.5.5-1-.5-1-.5" 
            fill="none" stroke="currentColor" strokeWidth={sw * 0.3} strokeLinecap="round" opacity="0.7" transform="scale(0.8) translate(3.5, 0.5)"/>
      <path d="M14.5 6.5a1 1 0 0 1-1-1h2a1 1 0 0 1-1 1Z" opacity="0.5" transform="scale(0.8) translate(3.5, 0.5)"/>
    </IconBase>
  );
};

export default MedicalRecordsIcon;
