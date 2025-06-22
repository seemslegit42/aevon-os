
import React from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const CADDesignIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 1.8;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline CAD Design Icon */}
      {/* 3D Wireframe Cube */}
      {/* Front Face */}
      <path d="M6 8h10v10H6V8Z" fill="none" stroke="currentColor" strokeWidth={sw * 0.4} opacity="0.7"/>
      {/* Top Face */}
      <path d="M6 8l4-4h6l-4 4H6Z" fill="none" stroke="currentColor" strokeWidth={sw * 0.3} opacity="0.6"/>
      {/* Right Face */}
      <path d="M16 8l4-4v10l-4 4V8Z" fill="none" stroke="currentColor" strokeWidth={sw * 0.3} opacity="0.6"/>
      {/* Connecting Edges */}
      <path d="M10 4v4M16 4v4M10 18v4M20 14v4" fill="none" stroke="currentColor" strokeWidth={sw * 0.2} opacity="0.5"/>
      <circle cx="6" cy="8" r="0.75" fill="currentColor" opacity="0.4"/>
      <circle cx="16" cy="8" r="0.75" fill="currentColor" opacity="0.4"/>
      <circle cx="10" cy="4" r="0.75" fill="currentColor" opacity="0.4"/>

      {/* Crystalline Cursor/Stylus */}
      <path d="M18 15l3.5-3.5-1-1L17 14l1 1Z"/> {/* Tip */}
      <path d="M17 14l-4-4 1-1 4 4-1 1Z" opacity="0.8"/> {/* Body */}
      <path d="M18 15l-1.5-1.5L13 17l1.5 1.5L18 15Z" opacity="0.6"/> {/* Facet */}
      <path d="M13.5 12.5l1.5-1.5.5.5-1.5 1.5-.5-.5Z" opacity="0.4"/> {/* End facet */}
    </IconBase>
  );
};

export default CADDesignIcon;
