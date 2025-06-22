
import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const UploadIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Arrow pointing upwards - More Chiseled Facets */}
      <path d="M12 6L4.5 13.5h5V22h5V13.5h5L12 6Z"/>
      <path d="M12 6l-5.5 5.5H12V22L15 13.5H12l3-4h-3L15 7h-3Z" className="if-o1"/> {/* Arrow head top and shaft facets */}
      <path d="M9.5 22h5V13.5l-2.5 2.5L9.5 13.5V22Z" className="if-o1"/> {/* Arrow shaft facets */}
      <path d="M12 22l2.5-1.5h-5L12 22Z" className="if-o2"/> {/* Arrow shaft bottom edge */}
      <path d="M19.5 13.5l-2.5-2.5H19.5v2.5Z" className="if-o4" /> {/* Arrow wing right */}
      <path d="M4.5 13.5l2.5-2.5H4.5v2.5Z" className="if-o4" /> {/* Arrow wing left */}
      <path d="M12 6l3 3h-6l3-3Z" className="if-o6"/> {/* Arrow tip reflection */}
      
      {/* Tray/Base - More Defined Crystalline Edges */}
      <path d="M2.5 6h19V2H2.5v4Z"/>
      <path d="M21.5 6L12 8.5l-9.5-2.5h19Z" className="if-o2"/> {/* Tray bottom facet */}
      <path d="M3 2L2.5 6h19l-.5-4H3Z" className="if-o1"/> {/* Tray front/top facet */}
      <path d="M2.5 6V5L12 7l9.5-2V5H2.5Z" className="if-o4"/> {/* Tray top shadow */}
      <path d="M2.5 2h19V0.5H2.5V2Z" className="if-o5" /> {/* Tray top edge highlight */}
    </IconBase>
  );
});
UploadIcon.displayName = 'UploadIcon';

export default UploadIcon;
