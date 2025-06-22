import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const StarIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Main star shape - Sharper Points and Robust Structure */}
      <path d="M12 .5L15.39 7.37 23 8.39l-5.82 5.66 1.37 8.05L12 18.39l-6.55 3.71 1.37-8.05L1 8.39l7.61-1.02L12 .5Z"/>
      
      {/* Facets to enhance 3D effect - More Defined */}
      <path d="M12 .5v17.89L5.45 22.1l1.37-8.05L1 8.39l7.61-1.02L12 .5Z" className="if-o1"/>
      <path d="M12 18.39V.5l3.39 6.87L23 8.39l-5.82 5.66 1.37 8.05L12 18.39Z" className="if-o2"/>
      
      {/* Central pentagon facet - More Prominent */}
      <path d="M12 15.5L14.75 12.5l-1.8-4.75H11.05L9.25 12.5 12 15.5Z" className="if-o3"/>
      <path d="M12 8.75L9.25 12.5l2.75 3L14.75 12.5 12 8.75Z" className="if-o6"/> {/* Inner reflection */}
      
      {/* Additional subtle facets for sharpness and central depth */}
      <path d="M12 .5L13.75 7.37H10.25L12 .5Z" className="if-o5"/>
      <path d="M20.55 8.39l-6.36.9L12 15.5l-2.19-6.21-6.36-.9 5 4.88L7.03 20.05l4.97-3 4.97 3-1.07-6.23 5.00-4.88Z" className="if-o6" fillRule="evenodd"/>
      <path d="M12 8.5l2.62 4.75L12 15.5l-2.62-2.25L12 8.5Z" className="if-o5"/>
      <path d="M12 .5L1 8.39l5.45 5.3L12 1Z" transform="rotate(72 12 12)" className="if-o6"/>
    </IconBase>
  );
});
StarIcon.displayName = 'StarIcon';

export default StarIcon;
