import React from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const TelemedicineIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 1.8;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline Telemedicine Icon */}
      {/* Screen/Device Frame */}
      <path d="M20.5 3.5H3.5C2.67 3.5 2 4.17 2 5v14c0 .83.67 1.5 1.5 1.5h17c.83 0 1.5-.67 1.5-1.5V5c0-.83-.67-1.5-1.5-1.5Z"/>
      <path d="M20.5 3.5L12 2l-8.5 1.5V5c0 .28.22.5.5.5h16c.28 0 .5-.22.5-.5V5C22 4.17 21.33 3.5 20.5 3.5Z" opacity="0.6"/> {/* Top Bevel */}
      <path d="M3.5 19.5L12 21l8.5-1.5V19c0-.28-.22-.5-.5-.5h-16c-.28 0-.5.22-.5.5v.5Z" opacity="0.5"/> {/* Bottom Bevel */}
      <path d="M20.5 5H3.5v14h17V5Z" opacity="0.1" /> {/* Screen Surface */}

      {/* Stylized Stethoscope on Screen */}
      {/* Chest Piece */}
      <circle cx="12" cy="13.5" r="2.5" opacity="0.8"/>
      <path d="M12 11A2.5 2.5 0 0 0 9.5 13.5H12v-2.5Z" opacity="0.5"/>
      {/* Tubing */}
      <path d="M12 11C12 8.5 10.5 7 9 7S6.5 8 6.5 9.5M12 11c0-2.5 1.5-4 3-4s2.5 1.5 2.5 3.5" 
            fill="none" stroke="currentColor" strokeWidth={sw * 0.5} strokeLinecap="round" opacity="0.7"/>
      {/* Earpieces */}
      <path d="M6.5 9.5a1 1 0 1 0-2 0 1 1 0 0 0 2 0Z" opacity="0.7"/>
      <path d="M17.5 9.5a1 1 0 1 0-2 0 1 1 0 0 0 2 0Z" opacity="0.7"/>
    </IconBase>
  );
};

export default TelemedicineIcon;
