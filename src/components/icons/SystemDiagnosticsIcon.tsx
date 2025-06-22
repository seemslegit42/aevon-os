import React from 'react';
import IconBase, { ICON_GRADIENT_ID } from '../IconBase';
import { IconProps } from '../../types';

const SystemDiagnosticsIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 1.8;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline System Diagnostics Icon */}
      {/* Background System Graph/Monitor Line */}
      <path d="M3 15h3l2-4 3 6 2.5-4 2.5 3h3.5" 
            fill="none" stroke={`url(#${ICON_GRADIENT_ID})`} strokeWidth={sw * 0.5} strokeLinecap="round" strokeLinejoin="round" opacity="0.4"/>
      <path d="M3 15.5h2.5l2-4 .5.5 2.5 6 .5-.5 2-4 .5.5 2 3h3" 
            fill="none" stroke={`url(#${ICON_GRADIENT_ID})`} strokeWidth={sw * 0.3} strokeLinecap="round" strokeLinejoin="round" opacity="0.2"/>
      
      {/* Crystalline Wrench (Overlay) */}
      {/* Head */}
      <path d="M17.5 4.5a4 4 0 0 0-5.66 0L10 6.34V8h1.66l1.84-1.84a2 2 0 1 1 2.83 2.83L14.5 10.83V12h1.17l2.17-2.17a4 4 0 0 0 0-5.66Z"/>
      <path d="M17.5 4.5l-1.5 1.5h-1V4.5a4 4 0 0 1 2.5-1Z" opacity="0.7"/>
      <path d="M13.66 12l-1.83 1.83a2 2 0 0 0 2.83 2.83l1.83-1.83V12h-2.83Z" opacity="0.6"/>
      {/* Handle */}
      <path d="M9.5 8.5l-5 5-1-1 5-5 1 1Z" opacity="0.9"/>
      <path d="M9.5 8.5L4.5 13.5l.5.5L8.5 9.5l1-1Z" opacity="0.5"/>
    </IconBase>
  );
};

export default SystemDiagnosticsIcon;
