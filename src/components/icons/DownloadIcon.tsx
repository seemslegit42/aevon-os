import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const DownloadIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Arrow - More Chiseled Facets */}
      <path d="M12 18L4.5 10.5h5V2h5v8.5h5L12 18Z"/>
      <path d="M12 18l5.5-5.5H12V2L9 10.5h3l-3 4h3L9 17h3Z" className="if-o1"/> {/* Arrow head bottom and shaft facets */}
      <path d="M14.5 2h-5V10.5l2.5-2.5L14.5 10.5V2Z" className="if-o1"/> {/* Arrow shaft facets */}
      <path d="M12 2L9 3.5h6L12 2Z" className="if-o2"/> {/* Arrow shaft top edge */}
      <path d="M19.5 10.5l-2.5 2.5H19.5v-2.5Z" className="if-o4" /> {/* Arrow wing right */}
      <path d="M4.5 10.5l2.5 2.5H4.5v-2.5Z" className="if-o4" /> {/* Arrow wing left */}
      <path d="M12 18l-3-3h6l-3 3Z" className="if-o6"/> {/* Arrow tip reflection */}
      
      {/* Tray/Base - More Defined Crystalline Edges */}
      <path d="M2.5 18h19v4H2.5v-4Z"/>
      <path d="M21.5 18L12 15.5l-9.5 2.5h19Z" className="if-o2"/> {/* Tray top facet */}
      <path d="M3 22L2.5 18h19l-.5 4H3Z" className="if-o1"/> {/* Tray front facet */}
      <path d="M2.5 18v1L12 17l9.5 2v-1H2.5Z" className="if-o4"/> {/* Tray bottom shadow */}
      <path d="M2.5 22h19v-1.5H2.5V22Z" className="if-o5" /> {/* Tray bottom edge highlight */}
    </IconBase>
  );
});
DownloadIcon.displayName = 'DownloadIcon';

export default DownloadIcon;
