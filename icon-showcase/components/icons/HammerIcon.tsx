
import React from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const HammerIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Crystalline Hammer Icon */}
      {/* Head */}
      <path d="M20.5 4.5c-1.5 0-2.8.75-3.51 1.5H6.5c-.83 0-1.5.67-1.5 1.5v4c0 .83.67 1.5 1.5 1.5h1.26L12 18.5l9.5-9.5V7.5c0-1.66-1.34-3-3-3Z"/>
      
      {/* Striking Face Facet */}
      <path d="M20.5 4.5c-.83 0-1.58.34-2.12.88L15.5 8H20v-.5c0-1.38-1.12-2.5-2.5-2.5h-1Z" opacity="0.7"/>
      <path d="M6.5 6H17c.45-.75 1.2-1.5 2-1.5h-1V4.5H6.5c-.28 0-.5.22-.5.5s.22.5.5.5Z" opacity="0.5"/>
      
      {/* Claw Facet */}
      <path d="M5 7.5v4c0 .28-.22.5-.5.5S4 11.78 4 11.5v-4C4 6.67 4.67 6 5.5 6H6v1.5H5Z" opacity="0.6"/>
      <path d="M7.76 13L12 18.5l1.5-1.5L8.5 12H7.76Z" opacity="0.4"/>

      {/* Handle */}
      <path d="M10.5 13.5L4.75 19.25l-1.5-1.5L9 12l1.5 1.5Z"/>
      <path d="M10.5 13.5L3.25 20.75l1.5 1.5L12 15l-1.5-1.5Z" opacity="0.7"/>
    </IconBase>
  );
};

export default HammerIcon;
