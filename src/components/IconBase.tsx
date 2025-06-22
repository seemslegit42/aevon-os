
import React, { forwardRef } from 'react';

interface IconBaseProps {
  children: React.ReactNode;
  width?: string | number;
  height?: string | number;
  viewBox?: string;
  className?: string;
  strokeWidth?: number;
  id?: string; // Added optional id
}

export const ICON_GRADIENT_ID = "lexvon-os-icon-gradient"; // Unique ID

const IconBase = forwardRef<SVGSVGElement, IconBaseProps>(({
  children,
  width = "24",
  height = "24",
  viewBox = "0 0 24 24",
  className = "",
  id,
  // strokeWidth is accepted but not directly applied to the parent svg element here
  // as the design is primarily fill-based. Individual paths within children can use it if needed.
}, ref) => {
  return (
    <svg
      ref={ref}
      id={id}
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={viewBox}
      fill={`url(#${ICON_GRADIENT_ID})`} 
      stroke="none" 
      className={className}
      aria-hidden="true" 
    >
      <defs>
        <linearGradient id={ICON_GRADIENT_ID} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#4A7A2A', stopOpacity: 1 }} />   
          <stop offset="35%" style={{ stopColor: '#558B2F', stopOpacity: 1 }} />  
          <stop offset="75%" style={{ stopColor: '#6BC4A7', stopOpacity: 1 }} />  
          <stop offset="100%" style={{ stopColor: '#79F7FF', stopOpacity: 1 }} /> 
        </linearGradient>
      </defs>
      {children}
    </svg>
  );
});

IconBase.displayName = 'IconBase'; // Adding displayName for better debugging

export default IconBase;