
import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const MaximizeIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Top-left corner - More Sculpted */}
      <path d="M10 2H2.5L2 2.5v7.5h2V4l4.25-1V2Z"/>
      <path d="M10 2L9.25 2.75H2.5v2.5L2 5.75V2.5L2.5 2H10Z" className="if-o1"/>
      <path d="M2.5 9.5H10V8H3.25L2.5 9.5Z" className="if-o3"/>
      <path d="M2 2.5L2.5 2h1.5V9.5H2V2.5Z" className="if-o5"/> {/* Inner edge facet */}
      <path d="M10 2L2 4.5v5L4.5 10h5L10 2Z" className="if-o6"/>

      {/* Top-right corner - More Sculpted */}
      <path d="M14 2H21.5l.5.5v7.5h-2V4l-4.25-1V2Z"/>
      <path d="M14 2l.75.75H21.5v2.5L22 5.75V2.5L21.5 2H14Z" className="if-o1"/>
      <path d="M21.5 9.5H14V8h6.75L21.5 9.5Z" className="if-o3"/>
      <path d="M22 2.5L21.5 2h-1.5V9.5H22V2.5Z" className="if-o5"/> {/* Inner edge facet */}
      <path d="M14 2l8 2.5v5L19.5 10h-5L14 2Z" className="if-o6"/>
      
      {/* Bottom-left corner - More Sculpted */}
      <path d="M10 22H2.5L2 21.5v-7.5h2V20l4.25 1V22Z"/>
      <path d="M10 22l-.75-.75H2.5v-2.5L2 18.25V21.5L2.5 22H10Z" className="if-o1"/>
      <path d="M2.5 14.5H10V16H3.25L2.5 14.5Z" className="if-o3"/>
      <path d="M2 21.5L2.5 22h1.5V14.5H2V21.5Z" className="if-o5"/> {/* Inner edge facet */}
      <path d="M10 22L2 19.5v-5L4.5 14h5L10 22Z" className="if-o6"/>

      {/* Bottom-right corner - More Sculpted */}
      <path d="M14 22H21.5l.5-.5v-7.5h-2V20l-4.25 1V22Z"/>
      <path d="M14 22l.75-.75H21.5v-2.5L22 18.25V21.5L21.5 22H14Z" className="if-o1"/>
      <path d="M21.5 14.5H14V16h6.75L21.5 14.5Z" className="if-o3"/>
      <path d="M22 21.5L21.5 22h-1.5V14.5H22V21.5Z" className="if-o5"/> {/* Inner edge facet */}
      <path d="M14 22l8-2.5v-5L19.5 14h-5L14 22Z" className="if-o6"/>
    </IconBase>
  );
});
MaximizeIcon.displayName = 'MaximizeIcon';

export default MaximizeIcon;
