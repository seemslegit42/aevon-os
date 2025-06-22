import React from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const BIDashboardIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 1.8;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline BI Dashboard Icon */}
      {/* Background Panel (subtle) */}
      <rect x="2.5" y="3.5" width="19" height="17" rx="1.5" fill="currentColor" opacity="0.08"/>

      {/* Chart Element 1: Bar Chart (Top-Left) */}
      <path d="M5 7h2v5H5z M5 7L6 6.5l1 .5v5L6 12.5 5 12V7Z" opacity="0.8"/>
      <path d="M7.5 9h2v3h-2z M7.5 9L8.5 8.5l1 .5v3L8.5 12.5l-1-.5V9Z" opacity="0.8"/>
      <path d="M10 6h2v6H10z M10 6L11 5.5l1 .5v6L11 12.5l-1-.5V6Z" opacity="0.8"/>

      {/* Chart Element 2: Line Graph (Top-Right) */}
      <path d="M14 6l2.5 2.5 2-2 2.5 3.5" fill="none" stroke="currentColor" strokeWidth={sw*0.5} opacity="0.7"/>
      <path d="M14 6.25l2.25 2.5.25-.25 1.75-2 .25.25 2.25 3.5.25-.25" fill="none" stroke="currentColor" strokeWidth={sw*0.3} opacity="0.4"/>

      {/* Chart Element 3: Pie Chart (Bottom-Left) */}
      <path d="M8.5 14.5a3.5 3.5 0 1 0-7 0v1h3.5A3.5 3.5 0 0 0 8.5 14.5Z" opacity="0.8"/>
      <path d="M5 12a3.5 3.5 0 0 1 3.5-3.5V12H5Z" opacity="0.6"/>
      
      {/* KPI Number/Block (Bottom-Right) */}
      <path d="M14 14.5h5v3h-5v-3Z M14 14.5L16.5 13.5l2.5 1v3l-2.5 1-2.5-1v-3Z" opacity="0.9"/>
      <path d="M15 15.5h3" stroke="currentColor" strokeWidth={sw*0.4} opacity="0.5"/>
    </IconBase>
  );
};

export default BIDashboardIcon;
