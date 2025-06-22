
import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const FlagIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Pole - More Polished and 3D */}
      <path d="M6 22.5V1.5M5.15 22.5L6 23.5l.85-1V1.5L6 0.5l-.85 1V22.5Z" className="if-o1"/>
      <path d="M6 1.5L4.5 2.5V0.75L6 1.5Z" className="if-o2"/>
      <path d="M7 2H5L6 0.5 7 2Z" className="if-o5" /> {/* Top cap */}

      {/* Flag cloth - More Dynamic, Faceted Waves */}
      <path d="M6 3s3-2 6.5-2S19 3.5 22.5 3.5s2.5-2 2.5-2V11.5s-2.5 2-6 2S13 11 9.5 11s-3.5 2-3.5 2V3Z"/>
      
      {/* Flag top edge facet */}
      <path d="M6 3S9 1 12.5 1s6.5 2.5 10 2.5S25 1.5 25 1.5l-1.5 3S20.5 8 17 8s-6.5-2.5-10-2.5S4.5 3.5 4.5 3.5V3Z" className="if-o2"/>
      
      {/* Flag wave/fold facets for 3D effect */}
      <path d="M6 11.5s3-2 6.5-2S19 12 22.5 12s2.5-2 2.5-2V4.5s-2.5 2-6 2S13 4 9.5 4s-3.5 2-3.5 2V11.5Z" className="if-o3"/>
      <path d="M9.5 11S7.5 9 6 9V4.5S9.5 6.5 13 6.5s6-2.5 9.5-2.5v5S20 11.5 16.5 11.5s-6.5 2.5-6.5 2.5Z" className="if-o4" fillRule="evenodd"/>
      <path d="M6 3V11.5l-2-1.5V1.5L6 3Z" className="if-o5"/> {/* Left edge depth */}
      <path d="M22.5 3.5S19 8 12.5 8 6 3 6 3L12.5 1l10 2.5Z" className="if-o6"/> {/* Top surface shine */}
    </IconBase>
  );
});
FlagIcon.displayName = 'FlagIcon';

export default FlagIcon;
