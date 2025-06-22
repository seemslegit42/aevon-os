import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const CompassIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Outer Casing - Enhanced Bevels */}
      <path d="M12 1C5.93 1 1 5.93 1 12s4.93 11 11 11 11-4.93 11-11S18.07 1 12 1Zm0 20.5c-5.25 0-9.5-4.25-9.5-9.5S6.75 2.5 12 2.5s9.5 4.25 9.5 9.5S17.25 21.5 12 21.5Z"/>
      <path d="M12 2.5A9.5 9.5 0 0 0 2.5 12h1.5c.28-4.42 3.85-8 8-8V2.5Z" className="if-o1"/>
      <path d="M12 21.5a9.5 9.5 0 0 0 9.5-9.5h-1.5c-.28 4.42-3.85 8-8 8V21.5Z" className="if-o2"/>
      <path d="M12 2.5L2.5 12l9.5 9.5V2.5Z" className="if-o5"/>
      <path d="M12 2.5L21.5 12l-9.5 9.5V2.5Z" className="if-o5"/>
      <path d="M12 1L2.5 12l-.5-1L12 1Z" className="if-o6"/> {/* Top-left shine */}

      {/* Compass Needle / Rose - Sharper Points and More Jewel-Like */}
      <path d="M12 4l-3.5 7.5 3.5 7.5.9-2V6.9L12 4Z"/> {/* N-S Main */}
      <path d="M12 4l3.5 7.5-3.5 7.5-.9-2V6.9L12 4Z" className="if-o1"/> {/* N-S Facet */}
      <path d="M20 12l-8-3.5-8 3.5.9.4h14.2l.9-.4Z" className="if-o1"/> {/* E-W Main */}
      <path d="M20 12l-8 3.5-8-3.5-.9.4h14.2l-.9-.4Z" className="if-o2"/> {/* E-W Facet */}
      <path d="M12 4L15 11H9L12 4Z" className="if-o4" /> {/* N point facet */}
      <path d="M12 20L15 13H9L12 20Z" className="if-o4" /> {/* S point facet */}
      <path d="M12 4L9 11.5l3-1 3 1L12 4Z" className="if-o6"/> {/* Top V highlight */}
      
      {/* Center Pin - More Distinct and Jewel-Like */}
      <circle cx="12" cy="12" r="2" className="if-o1"/>
      <path d="M12 10.25L11 11.5l1 1 1-1L12 10.25Z" className="if-o1"/>
      <path d="M12 10.25L10.25 12h3.5L12 10.25Z" className="if-o5"/>
    </IconBase>
  );
});
CompassIcon.displayName = 'CompassIcon';

export default CompassIcon;
