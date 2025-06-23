import type { SVGProps } from 'react';

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: string | number;
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
  mirrored?: boolean;
}
