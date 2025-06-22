
import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const MenuIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  const barHeight = 4;
  const barYPadding = 3.5;
  const y1 = 4;
  const y2 = y1 + barHeight + barYPadding;
  const y3 = y2 + barHeight + barYPadding;
  const x = 3;
  const w = 18;
  const rx = 1.5;

  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Top Bar */}
      <rect x={x} y={y1} width={w} height={barHeight} rx={rx}/>
      <path d={`M${x} ${y1} L${x + w/2} ${y1 - barHeight * 0.3} L${x+w} ${y1} V${y1 + barHeight} L${x + w/2} ${y1 + barHeight * 1.3} L${x} ${y1 + barHeight} V${y1}Z`} opacity="0.5" />
      
      {/* Middle Bar */}
      <rect x={x} y={y2} width={w} height={barHeight} rx={rx}/>
      <path d={`M${x} ${y2} L${x + w/2} ${y2 - barHeight * 0.3} L${x+w} ${y2} V${y2 + barHeight} L${x + w/2} ${y2 + barHeight * 1.3} L${x} ${y2 + barHeight} V${y2}Z`} opacity="0.5" />

      {/* Bottom Bar */}
      <rect x={x} y={y3} width={w} height={barHeight} rx={rx}/>
      <path d={`M${x} ${y3} L${x + w/2} ${y3 - barHeight * 0.3} L${x+w} ${y3} V${y3 + barHeight} L${x + w/2} ${y3 + barHeight * 1.3} L${x} ${y3 + barHeight} V${y3}Z`} opacity="0.5" />
    </IconBase>
  );
});
MenuIcon.displayName = 'MenuIcon';

export default MenuIcon;
