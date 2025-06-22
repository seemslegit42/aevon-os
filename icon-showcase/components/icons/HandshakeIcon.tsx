import React from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const HandshakeIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Crystalline Handshake Icon */}
      {/* Hand 1 (Bottom-Left to Top-Right) */}
      <path d="M9 14L2 10.5l1.2-1.8 5.4 3.6 1.4-1.8-6.3-4.2 1.8-2.4L13.5 9.6l-3.3 4.4H9Z"/>
      <path d="M9 14l-6.3-3.6 1.2-1.8.6.6 4.5 3.15 1.4-1.8-1.4-.9-4.5-3.15.6-.6 1.8-2.4 7.65 5-1.8 2.7-1.8 1.8Z" opacity="0.65"/>
      
      {/* Hand 2 (Top-Left to Bottom-Right) */}
      <path d="M15 10L22 13.5l-1.2 1.8-5.4-3.6-1.4 1.8 6.3 4.2-1.8 2.4L10.5 14.4l3.3-4.4H15Z"/>
      <path d="M15 10l6.3 3.6-1.2 1.8-.6-.6-4.5-3.15-1.4 1.8 1.4.9 4.5 3.15-.6.6-1.8 2.4-7.65-5 1.8-2.7 1.8-1.8Z" opacity="0.65"/>

      {/* Clasped Area Facets */}
      <path d="M12 12.5l1.25 1.25-1.25 1.25-1.25-1.25L12 12.5Z" opacity="0.85"/> {/* Central diamond */}
      <path d="M10.75 11l2.5 2.5-1.25 1.25-2.5-2.5 1.25-1.25Z" opacity="0.45"/>
      <path d="M13.25 13l-2.5-2.5 1.25-1.25 2.5 2.5-1.25 1.25Z" opacity="0.45"/>
    </IconBase>
  );
};

export default HandshakeIcon;