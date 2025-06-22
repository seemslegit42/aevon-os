import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const TerminalIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Main Frame */}
      <path d="M20 3H4C2.9 3 2 3.9 2 5v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H4V5h16v14z"/>
      <path d="M4 3L12 2l8 1v2H4V3z" opacity="0.6"/> {/* Top Bevel */}
      
      {/* Prompt / Greater Than Symbol */}
      <path d="M6.5 14.5l3-2.5-3-2.5.75-1.5L12 12l-4.75 3.5-.75-1.5z"/>
      {/* Cursor / Underscore */}
      <path d="M10.5 15h5v1.5h-5V15Z" opacity="0.8"/>
    </IconBase>
  );
});
TerminalIcon.displayName = 'TerminalIcon';

export default TerminalIcon;
