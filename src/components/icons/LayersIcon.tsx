import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const LayersIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Bottom Layer - Sharper Edges */}
      <path d="M0 14l12 7 12-7-2.5-1.5-9.5 5.5-9.5-5.5L0 14Z" />
      <path d="M12 22.5l9.5-5.5L23 17.75l-11 6.25-11-6.25L2.5 17l9.5 5.5Z" className="if-o1"/>
      <path d="M0 14l12-7H0v7Z" className="if-o4"/>
      <path d="M24 14l-12-7h12v7Z" className="if-o4"/>
      <path d="M0 12.5l12 1.75L24 12.5V14L12 15.75L0 14v-1.5Z" className="if-o5"/> {/* Underside shadow */}
      
      {/* Middle Layer - Clearer Separation */}
      <path d="M0 9l12 7 12-7-2.5-1.5L12 13l-9.5-5.5L0 9Z" className="if-o1"/>
      <path d="M12 17.5l9.5-5.5L23 12.75l-11 6.25-11-6.25L2.5 12l9.5 5.5Z" className="if-o2"/>
      <path d="M0 9l12-7H0v7Z" className="if-o5"/>
      <path d="M24 9l-12-7h12v7Z" className="if-o5"/>
      <path d="M0 7.5l12 1.75L24 7.5V9L12 10.75L0 9V7.5Z" className="if-o6"/> {/* Underside shadow */}

      {/* Top Layer - Most Defined */}
      <path d="M12 0L0 7l2.5 1.5L12 3l9.5 5.5L24 7 12 0Z"/>
      <path d="M12 4.5L21.5 10l-9.5 5.5-9.5-5.5L12 4.5Z" className="if-o1"/>
      <path d="M12 0L0 7v1.5l24-2.5V7L12 0Z" className="if-o5"/>
      <path d="M12 3L2.5 8.5h19L12 3Z" className="if-o5"/> {/* Top surface highlight */}
      <path d="M12 0L0 7l12 7 12-7L12 0Z" className="if-o6" fillRule="evenodd"/> {/* Subtle full outline */}
    </IconBase>
  );
});
LayersIcon.displayName = 'LayersIcon';

export default LayersIcon;
