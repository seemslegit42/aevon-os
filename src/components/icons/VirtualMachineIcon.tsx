import React from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const VirtualMachineIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 1.8;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline Virtual Machine Icon */}
      {/* Outer Cube (Host Machine - more translucent) */}
      <path d="M3.5 5.5l8.5-4 8.5 4v10l-8.5 4-8.5-4v-10Z" opacity="0.6"/>
      {/* Top face of outer cube */}
      <path d="M12 1.5L3.5 5.5h17L12 1.5Z" opacity="0.4"/>
      {/* Left face of outer cube */}
      <path d="M3.5 5.5v10l8.5 4V9.5l-8.5-4Z" opacity="0.3"/>
      {/* Right face of outer cube */}
      <path d="M20.5 5.5v10l-8.5 4V9.5l8.5-4Z" opacity="0.3"/>

      {/* Inner Cube (Virtual Machine - more solid) */}
      <path d="M7.5 9.5l4.5-2.5 4.5 2.5v6l-4.5 2.5-4.5-2.5v-6Z" transform="translate(0, -1)"/>
      {/* Top face of inner cube */}
      <path d="M12 7L7.5 9.5h9L12 7Z" opacity="0.8" transform="translate(0, -1)"/>
      {/* Left face of inner cube */}
      <path d="M7.5 9.5v6l4.5 2.5V12l-4.5-2.5Z" opacity="0.7" transform="translate(0, -1)"/>
      {/* Right face of inner cube */}
      <path d="M16.5 9.5v6l-4.5 2.5V12l4.5-2.5Z" opacity="0.7" transform="translate(0, -1)"/>
    </IconBase>
  );
};

export default VirtualMachineIcon;
