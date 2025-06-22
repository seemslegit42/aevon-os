import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const EditIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Pencil Tip - Sharper Point and facets */}
      <path d="M22.5 3.5a3 3 0 0 0-4.24-4.24L15 2.5l4.24 4.24L22.5 3.5Z"/>
      <path d="M15 2.5L18.26-.74l2 2-3.26 3.24-2-2Z" className="if-o2" /> {/* Tip side facet */}
      <path d="M22.5 3.5L19.25 7.25l-4.24-4.24L18.26-.74l4.24 4.24Z" className="if-o4" /> {/* Tip front facet */}
      
      {/* Main Pencil Body - Clearer Hexagonal-like Facets */}
      <path d="M2.5 15.5L0 22.5l7-2.5L18.5 8.5l-4.24-4.24L2.5 15.5Zm12.76-13L17.5 5.5l-10 10-1.76-1.76 10-10Z"/>
      
      {/* Body facets for 3D effect */}
      <path d="M15 2.5L2.5 15l1.76 1.76L20.52 4.02l-3.26-2.08-2.26.56Z" className="if-o1"/>
      <path d="M18.5 8.5L17.24 7.24 4.74 19.74l1.76 1.76L18.5 8.5Z" className="if-o2"/>
      <path d="M2.5 15.5l12.76-13L17.5 3l-13 12.76-2-.26Z" className="if-o4"/>
      <path d="M2.5 15.5l-1.5 4.5 4.5-1.5 10-10-1.5-1.5-11.5 8.5Z" className="if-o6"/> {/* Overall pencil body shadow */}
      
      {/* Eraser area - More Distinct Crystalline Block */}
      <path d="M5 12.5L1 16.5l2.5 2.5L8 15.5l-3-3Z" className="if-o1"/>
      <path d="M1 16.5L0 18.5l2 2L3.5 19l-1-1V16.5H1Z" className="if-o3"/>
    </IconBase>
  );
});
EditIcon.displayName = 'EditIcon';

export default EditIcon;
