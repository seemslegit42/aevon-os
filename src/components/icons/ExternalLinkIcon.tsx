import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const ExternalLinkIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Box - Clearer Shape and Faceting */}
      <path d="M19.5 12.5v6.5c0 .83-.67 1.5-1.5 1.5H5c-1.1 0-2-.9-2-2V5.5c0-1.1.9-2 2-2h6.5V2H5C3.34 2 2 3.34 2 5v14c0 1.66 1.34 3 3 3h13c1.66 0 3-1.34 3-3V12.5h-1.5Z"/>
      <path d="M5 3.5H11.5V2H5C4.17 2 3.5 2.67 3.5 3.5v15c0 .83.67 1.5 1.5 1.5h13c.83 0 1.5-.67 1.5-1.5V12.5h-2v6.5H5V3.5Z" className="if-o2"/> {/* Box inner shadow/depth */}
      <path d="M5 2L3 3.5l1.5 1.5V17L3 19l2 2h13l1.5-1.5V11L21 12.5V2H5Z" className="if-o6" fillRule="evenodd"/>
      <path d="M11.5 2V3.5H5L3.5 2h8Z" className="if-o5"/> {/* Top frame edge */}
      <path d="M19.5 20.5H5L3.5 19v-13L5 4.5h14.5L21 6v13l-1.5 1.5Z" className="if-o6"/>

      {/* Arrow - Enhanced 3D Faceting */}
      <path d="M14.5 1.5h7v7l-7-7Z"/> {/* Arrow head */}
      <path d="M10 14l10-10-1.5-1.5-10 10L10 14Z"/> {/* Arrow body */}
      <path d="M21.5 5.5L14.5 12.5V1.5h7V5.5Z" className="if-o1"/> {/* Arrow head facet */}
      <path d="M15 1.5h-3.5L15 5l-3.5-3.5V1.5Z" className="if-o3"/> {/* Arrow body facet */}
      <path d="M21.5 1.5v3.5L19.5 3.5l2-2Z" className="if-o5" /> {/* Arrow tip highlight */}
      <path d="M10 14l1.5-1.5-10-10L0 4l10 10Z" className="if-o6"/> {/* Arrow shadow */}
    </IconBase>
  );
});
ExternalLinkIcon.displayName = 'ExternalLinkIcon';

export default ExternalLinkIcon;
