import React from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const ZapIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Main Lightning Bolt Shape */}
      <path d="M7 2v11h3v9l7-12h-4l3-8H7z"/>
      {/* Facets for 3D Effect */}
      <path d="M7 2L10 13h4L7 2z" opacity="0.6"/> 
      <path d="M10 13l-3 9 7-12h-1L10 13z" opacity="0.4"/>
    </IconBase>
  );
};

export default ZapIcon;