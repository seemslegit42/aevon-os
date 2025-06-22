import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const ChartBarIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Bar 1 */}
      <path d="M4 13h3v6H4v-6Z" />
      <path d="M4 13L5.5 12l1.5 1v6L5.5 20 4 19v-6Z" opacity="0.6"/>
      {/* Bar 2 */}
      <path d="M9 9h3v10H9V9Z" />
       <path d="M9 9L10.5 8l1.5 1v10L10.5 20 9 19V9Z" opacity="0.7"/>
      {/* Bar 3 */}
      <path d="M14 5h3v14h-3V5Z" />
      <path d="M14 5L15.5 4l1.5 1v14L15.5 20 14 19V5Z" opacity="0.8"/>
      {/* Base line */}
      <path d="M2 20h17v1H2v-1Z" opacity="0.5"/>
    </IconBase>
  );
});
ChartBarIcon.displayName = 'ChartBarIcon';

export default ChartBarIcon;
