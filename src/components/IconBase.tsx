import React, { forwardRef } from 'react';
import type { IconProps } from '../types';

export const ICON_GRADIENT_ID = 'crystalline-gradient';

const IconBase = forwardRef<SVGSVGElement, IconProps & { children: React.ReactNode, viewBox?: string }>(({
  children,
  width = "24",
  height = "24",
  size,
  viewBox = "0 0 24 24",
  className = "",
  strokeWidth,
  id,
}, ref) => {
  const finalSize = size || width;
  return (
    <svg
      ref={ref}
      id={id}
      xmlns="http://www.w3.org/2000/svg"
      width={finalSize}
      height={finalSize}
      viewBox={viewBox}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={ICON_GRADIENT_ID} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="50%" stopColor="hsl(var(--secondary))" />
          <stop offset="100%" stopColor="hsl(var(--accent))" />
        </linearGradient>
      </defs>
      {children}
    </svg>
  );
});

IconBase.displayName = 'IconBase';
export default IconBase;
