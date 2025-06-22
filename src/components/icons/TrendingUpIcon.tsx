import React from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const TrendingUpIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Main Arrow Line */}
      <path d="M16 5l1.41 1.41L11.83 12H20v2H9.83l-3.01 3.01L6 16.18 2.82 13 1.41 14.41 6 19l4.83-4.83L12.24 16H22V7h-2.17L16 10.17V5z"/>
      {/* Arrowhead for clarity */}
      <path d="M16 5h6v6h-2V7.83l-3.41 3.41L16 10.17V5z" opacity="0.7"/>
      {/* Line highlight */}
      <path d="M2.82 13l3.18 3.18L6 19l-4.41-4.41L1.41 13z M9.83 12.83L6 16.66l.82.82L11.66 12l-1.83-.83z" opacity="0.4"/>
    </IconBase>
  );
};

export default TrendingUpIcon;
