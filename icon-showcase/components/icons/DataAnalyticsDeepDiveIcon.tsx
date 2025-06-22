
import React from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const DataAnalyticsDeepDiveIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 1.8;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline Data Analytics Deep Dive Icon */}
      {/* Magnifying Glass */}
      <path d="M16.5 10.5a6 6 0 1 0-12 0 6 6 0 0 0 12 0Zm-1.5 0a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z"/> {/* Lens rings */}
      <path d="M10.5 6A4.5 4.5 0 0 0 6 10.5h4.5V6Z" opacity="0.6"/> {/* Lens top facet */}
      <path d="M15.25 15.25L20.5 20.5" strokeWidth={sw} stroke="currentColor" strokeLinecap="round"/> {/* Handle */}
      <path d="M15.25 15.25l-1-1 6.25 6.25-1 1-4.25-4.25Z" opacity="0.5"/> {/* Handle facet */}

      {/* Abstract Data Structure (under the lens) - Crystalline Shards/Bars */}
      {/* Bar 1 */}
      <path d="M7 11.5h2v3H7z" transform="translate(1,1) scale(0.6)" opacity="0.7"/>
      <path d="M7 11.5L8 10.75l1 .75v3L8 15.25l-1-.75v-3Z" transform="translate(1,1) scale(0.6)" opacity="0.4"/>
      {/* Bar 2 */}
      <path d="M10.5 9.5h2v5h-2z" transform="translate(1,1) scale(0.6)" opacity="0.8"/>
      <path d="M10.5 9.5L11.5 8.75l1 .75v5l-1 .75-1-.75v-5Z" transform="translate(1,1) scale(0.6)" opacity="0.5"/>
      {/* Bar 3 */}
      <path d="M14 10.5h2v4h-2z" transform="translate(1,1) scale(0.6)" opacity="0.75"/>
      <path d="M14 10.5L15 9.75l1 .75v4L15 15.25l-1-.75v-4Z" transform="translate(1,1) scale(0.6)" opacity="0.45"/>
    </IconBase>
  );
};

export default DataAnalyticsDeepDiveIcon;
