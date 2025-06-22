
import React from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const SmartBuildingIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 1.8;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline Smart Building Icon */}
      {/* Building Silhouette (Angular, Faceted) */}
      <path d="M12 3L4 9v11h16V9L12 3Z M6 10.5v7.5h3.5V12H6Zm5.5 7.5V9.5h1V18h-1Zm1.5-8.5v8.5H18V10.5h-3.5Z"/>
      {/* Roof Facets */}
      <path d="M12 3L4 9h16L12 3Z" opacity="0.7"/>
      <path d="M12 3L4 9v2.5l8-4.5 8 4.5V9L12 3Z" opacity="0.4"/>
      {/* Wall Facets */}
      <path d="M4 9v11l4-2V9L4 9Z" opacity="0.5"/>
      <path d="M20 9v11l-4-2V9L20 9Z" opacity="0.5"/>

      {/* Radiating Signals/Nodes (Crystalline Strokes) */}
      {/* Top Signal */}
      <path d="M12 3s0-1.5 0-2M12 3c-1.5 0-1.5-1-1.5-1.5s.5-1 1.5-1" 
            fill="none" stroke="currentColor" strokeWidth={sw * 0.5} strokeLinecap="round" opacity="0.8"/>
      <circle cx="12" cy="1" r="1" fill="currentColor" opacity="0.6"/>
      {/* Side Signals */}
      <path d="M4 9S2.5 8 2.5 7M20 9s1.5-1 1.5-2" 
            fill="none" stroke="currentColor" strokeWidth={sw * 0.4} strokeLinecap="round" opacity="0.7"/>
      <circle cx="2.5" cy="6" r="0.75" fill="currentColor" opacity="0.5"/>
      <circle cx="21.5" cy="6" r="0.75" fill="currentColor" opacity="0.5"/>
      
      {/* Small Nodes on Building (Windows/Sensors) */}
      <rect x="7" y="13" width="1.5" height="2" rx="0.5" opacity="0.3"/>
      <rect x="15.5" y="13" width="1.5" height="2" rx="0.5" opacity="0.3"/>
    </IconBase>
  );
};

export default SmartBuildingIcon;
