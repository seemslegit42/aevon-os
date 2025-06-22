
import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const CreditCardIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Card Body - Crisper Outline and Edges */}
      <path d="M22.5 3.5H1.5C.67 3.5 0 4.17 0 5v14c0 .83.67 1.5 1.5 1.5h21c.83 0 1.5-.67 1.5-1.5V5c0-.83-.67-1.5-1.5-1.5Z"/>
      <path d="M1.5 5.5h21V5c0-.55-.45-1-1-1H2.5c-.55 0-1 .45-1 1v.5Z" className="if-o1"/> {/* Top edge */}
      <path d="M0 6.5L12 3.5l12 3v11L12 20.5L0 17.5V6.5Z" className="if-o3"/> {/* Front/back volume shadow */}
      <path d="M22.5 19.5H1.5V5.5h21V19.5Z" className="if-o6" /> {/* Inner surface shadow */}
      <path d="M24 5L22.5 3.5H1.5L0 5v1.5h24V5Z" className="if-o5"/> {/* Top highlight */}
      <path d="M0 19.5V5L.75 3.5H23.25L24 5v14.5l-.75 1.5H.75L0 19.5Z" className="if-o6" fillRule="evenodd"/>
      
      {/* Magnetic Strip Area - More Defined Facets */}
      <path d="M0 8h24v3.5H0v-3.5Z" className="if-o1"/>
      <path d="M0 8l12-.75 12 .75v1L12 8l-12 1V8Z" className="if-o2" /> {/* Top facet of strip */}
      <path d="M0 11h24v.5L12 12.25l-12-.75V11Z" className="if-o4" /> {/* Bottom facet of strip */}
      <path d="M24 8H0v.75h24V8Z" className="if-o6"/> {/* Strip shine */}

      {/* Chip Area - More Distinct Faceted Square */}
      <path d="M4 13h4v3.5H4v-3.5Z" className="if-o1"/>
      <path d="M4 13L6 12l2 1v1.75L6 15.5l-2-.75V13Z" className="if-o2"/> {/* Top facet of chip */}
      <path d="M4 15.25L6 14.75l2 .5v.5L6 16.5l-2-.5v-.5Z" className="if-o3"/> {/* Bottom facet of chip */}
      <rect x="4.75" y="13.75" width="2.5" height="2" rx="0.5" className="if-o5"/> {/* Inner chip detail */}
    </IconBase>
  );
});
CreditCardIcon.displayName = 'CreditCardIcon';

export default CreditCardIcon;
