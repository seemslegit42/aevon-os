import type { ComponentType } from 'react';

export interface IconProps {
  className?: string;
  size?: number; // Shortcut for width & height if they are the same
  strokeWidth?: number; 
  id?: string; // Optional id for the SVG element
}

export interface IconDisplayInfo {
    component: ComponentType<IconProps>;
    name: string;
    tags: string[];
    defaultStrokeWidth: number;
}
