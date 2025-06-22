// src/types/icon.ts
import type { CSSProperties, ForwardedRef } from 'react';

export interface IconProps {
  className?: string;
  size?: number | string;
  style?: CSSProperties;
  strokeWidth?: number;
  ref?: ForwardedRef<SVGSVGElement>;
  id?: string;
}
