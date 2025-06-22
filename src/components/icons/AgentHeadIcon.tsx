import React from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const AgentHeadIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Crystalline Agent Head Icon */}
      {/* Main Head Shape (Abstract, Faceted Ovoid/Helmet) */}
      <path d="M12 2.5C7.86 2.5 4.5 5.86 4.5 10c0 2.1.84 3.99 2.21 5.37L12 21.5l5.29-6.13C18.66 13.99 19.5 12.1 19.5 10c0-4.14-3.36-7.5-7.5-7.5Z"/>
      
      {/* Front "Visor" or "Faceplate" Facet */}
      <path d="M12 5c-2.36 0-4.37 1.44-5.11 3.48L12 14.5l5.11-6.02C16.37 6.44 14.36 5 12 5Z" opacity="0.88"/>
      
      {/* Side Facets for 3D effect */}
      <path d="M6.71 15.37L4.5 10c0-1.68.67-3.19 1.76-4.3L12 17.5l-5.29-2.13Z" opacity="0.7"/>
      <path d="M17.29 15.37L19.5 10c0-1.68-.67-3.19-1.76-4.3L12 17.5l5.29-2.13Z" opacity="0.7"/>

      {/* "Sensor" or "Eye" detail - subtle */}
      <circle cx="12" cy="10.25" r="1.25" opacity="0.45"/>
      <path d="M12 9L10.9 9.8l1.1 1.1 1.1-1.1L12 9Z" opacity="0.6"/>

      {/* Chin/Neck Area Facet */}
      <path d="M10 18.5l2 2.5 2-2.5H10Z" opacity="0.8"/>
      <path d="M12 21.5l3.15-3.55c.31-.35.53-.76.65-1.2H8.2c.12.44.34.85.65 1.2L12 21.5Z" opacity="0.3"/>
    </IconBase>
  );
};

export default AgentHeadIcon;
