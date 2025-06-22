import React from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const APIIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 2;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline API Icon */}
      {/* Block 1 (Left/Socket) */}
      <path d="M3.5 8h7v8h-7V8Z M3.5 8L7 6.5l3.5 1.5v8L7 17.5l-3.5-1.5V8Z"/>
      <path d="M7 6.5L3.5 8h7L7 6.5Z" opacity="0.6"/> {/* Top face */}
      {/* Socket holes */}
      <circle cx="5.5" cy="10.5" r="1" opacity="0.4"/>
      <circle cx="8.5" cy="13.5" r="1" opacity="0.4"/>

      {/* Block 2 (Right/Plug) */}
      <path d="M13.5 8h7v8h-7V8Z M13.5 8L17 6.5l3.5 1.5v8L17 17.5l-3.5-1.5V8Z"/>
      <path d="M17 6.5L13.5 8h7L17 6.5Z" opacity="0.6"/> {/* Top face */}
      {/* Plug pins */}
      <rect x="14.5" y="9.75" width="2" height="1.5" rx="0.5" opacity="0.7"/>
      <rect x="17.5" y="12.75" width="2" height="1.5" rx="0.5" opacity="0.7"/>

      {/* Connecting/Interface Area (Subtle suggestion of connection) */}
      <path d="M10.5 11h3M10.5 12.5l1.5 1.5V11z" opacity="0.2"/>
      <path d="M11 10L13 12l-2 2" stroke="currentColor" strokeWidth={sw*0.2} strokeLinecap="round" opacity="0.1" fill="none"/>
    </IconBase>
  );
};

export default APIIcon;
