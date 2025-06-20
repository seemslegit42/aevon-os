// src/components/icons/CommandIcon.tsx
import React from 'react';
import { IconProps } from '../../../config';

export const CommandIcon: React.FC<IconProps> = ({ className, size = 16, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M200,80V56a24,24,0,0,0-24-24H80A24,24,0,0,0,56,56V80a24,24,0,0,0,24,24H176A24,24,0,0,0,200,80Zm0,96H176a24,24,0,0,0-24,24v24a24,24,0,0,0,24,24h24a24,24,0,0,0,24-24V176A24,24,0,0,0,200,176Zm-96,0H80a24,24,0,0,0-24,24v24a24,24,0,0,0,24,24h24a24,24,0,0,0,24-24V176A24,24,0,0,0,104,176Z" opacity="0.2"/>
    <path d="M200,40H176a16,16,0,0,0-16,16v8H88V56a16,16,0,0,0-16-16H56A16,16,0,0,0,40,72V88H56a16,16,0,0,0,16-16V64h80V88a16,16,0,0,0,16,16h16a16,16,0,0,0,16-16V72h16a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm24,120a16,16,0,0,0-16-16H192v16a16,16,0,0,0,16,16h16a16,16,0,0,0,16-16v-8H208a16,16,0,0,0-16,16v16H88V168a16,16,0,0,0-16-16H56a16,16,0,0,0-16,16v24a16,16,0,0,0,16,16H72v-16a16,16,0,0,0-16-16H40v8a16,16,0,0,0,16,16H72a16,16,0,0,0,16-16v-8h80v8a16,16,0,0,0,16,16h16a16,16,0,0,0,16-16v-8Z" fill="currentColor"/>
  </svg>
);