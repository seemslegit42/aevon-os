
import React, { forwardRef } from 'react';
import type { IconProps } from '../types';

interface IconBaseProps extends IconProps {
  children: React.ReactNode;
  viewBox?: string;
}

const IconBase = forwardRef<SVGSVGElement, IconBaseProps>(({
  children,
  width = "24",
  height = "24",
  size,
  viewBox = "0 0 24 24",
  className = "",
  strokeWidth,
  id,
}, ref) => {
  const finalSize = size || width; // Use size prop as a shortcut for width/height
  return (
    <svg
      ref={ref}
      id={id}
      xmlns="http://www.w3.org/2000/svg"
      width={finalSize}
      height={finalSize}
      viewBox={viewBox}
      fill="currentColor"
      stroke="none"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
});

IconBase.displayName = 'IconBase';

export default IconBase;
