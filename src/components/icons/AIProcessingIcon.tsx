import React from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const AIProcessingIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Crystalline AI Processing Icon */}
      {/* Central Core Crystal */}
      <path d="M12 10l3-2.5 -3-5.5 -3 5.5 3 2.5Z" /> {/* Top Part */}
      <path d="M12 10l-3 2.5L12 18l3-5.5-3-2.5Z" opacity="0.88"/> {/* Bottom Part */}
      <path d="M9 12.5L5.5 10l3-2.5Z" opacity="0.7"/> {/* Left Extension */}
      <path d="M15 12.5L18.5 10l-3-2.5Z" opacity="0.7"/> {/* Right Extension */}
      <path d="M12 2L13.5 3.5l-1.5 2-1.5-2L12 2Z" opacity="0.6"/> {/* Top facet of core */}

      {/* Orbiting/Flowing Crystalline Shards/Particles */}
      {/* Shard 1 (Top-Left) */}
      <path d="M6.5 7l1.5-.75 -.75-1.5 -1.5.75 .75 1.5Z" opacity="0.8"/>
      {/* Shard 2 (Top-Right) */}
      <path d="M17.5 7l-1.5-.75 .75-1.5 1.5.75 -.75 1.5Z" opacity="0.8"/>
      {/* Shard 3 (Bottom-Left) */}
      <path d="M7.5 15.5l-1 1.5 1.5.75 1-1.5 -1.5-.75Z" opacity="0.8"/>
      {/* Shard 4 (Bottom-Right) */}
      <path d="M16.5 15.5l1 1.5 -1.5.75 -1-1.5 1.5-.75Z" opacity="0.8"/>
      
      {/* Connecting light streaks / data flow lines (subtle) */}
      <path d="M8 7.5L10.5 9.5" strokeWidth={strokeWidth ? strokeWidth * 0.4 : 0.8} strokeLinecap="round" stroke="currentColor" opacity="0.35"/>
      <path d="M16 7.5L13.5 9.5" strokeWidth={strokeWidth ? strokeWidth * 0.4 : 0.8} strokeLinecap="round" stroke="currentColor" opacity="0.35"/>
      <path d="M8.5 15L11 12" strokeWidth={strokeWidth ? strokeWidth * 0.4 : 0.8} strokeLinecap="round" stroke="currentColor" opacity="0.35"/>
      <path d="M15.5 15L13 12" strokeWidth={strokeWidth ? strokeWidth * 0.4 : 0.8} strokeLinecap="round" stroke="currentColor" opacity="0.35"/>
    </IconBase>
  );
};

export default AIProcessingIcon;
