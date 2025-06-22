
import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const MicIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Head - More Rounded and Faceted Crystalline Shape */}
      <path d="M12 .5A5.5 5.5 0 0 0 6.5 6v6a5.5 5.5 0 0 0 11 0V6A5.5 5.5 0 0 0 12 .5Zm-4 5.5A4 4 0 0 1 12 2a4 4 0 0 1 4 4v6a4 4 0 0 1-4 4A4 4 0 0 1 8 12V6Z"/>
      <path d="M8 6L12 2l4 4v6L12 16l-4-4V6Z" className="if-o1"/>
      <path d="M12 .5A5.5 5.5 0 0 0 6.5 6v1.5L12 4l5.5 3.5V6A5.5 5.5 0 0 0 12 .5Z" className="if-o3"/>
      <path d="M6.5 6H17.5L12 16L6.5 6Z" className="if-o5" fillRule="evenodd"/>
      <path d="M12 2l-1.5 1.5h3L12 2Z" className="if-o6"/>
      
      {/* Stem and Connector - Cleaner */}
      <path d="M19.5 9.5v2c0 4-3.36 7.5-7.5 7.5s-7.5-3.5-7.5-7.5v-2H3v2c0 3.53 2.87 6.43 6.5 6.92V21H7.5v2h9V21h-2v-2.08c3.63-.49 6.5-3.39 6.5-6.92v-2H19.5Z"/>
      <path d="M19.5 9.5v2c0 .55-.45 1-1 1h-1.5V9.5h2.5Z" className="if-o4"/>
      <path d="M4.5 9.5v2c0 .55.45 1 1 1h1.5V9.5H4.5Z" className="if-o4"/>

      {/* Base - More Stable and Defined Facets */}
      <path d="M9 21v1H5.5V23h13v-1H15V21H9Z" className="if-o1"/>
      <path d="M12 19.5l-3.5 1.5V22h7v-1L12 19.5Z" className="if-o2"/>
      <path d="M15 21H9l1.5-1.5h3L15 21Z" className="if-o3"/>
    </IconBase>
  );
});
MicIcon.displayName = 'MicIcon';

export default MicIcon;
