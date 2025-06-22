
import React from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const ExcavatorIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 1.6;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline Excavator Icon */}
      {/* Tracks/Base */}
      <path d="M3 16h18v3H3v-3Z M3 16L12 14l9 2v3L12 21l-9-2v-3Z"/>
      <path d="M12 14L3 16h18L12 14Z" opacity="0.6"/>
      <circle cx="6" cy="17.5" r="1.25" opacity="0.4"/>
      <circle cx="18" cy="17.5" r="1.25" opacity="0.4"/>

      {/* Cabin */}
      <path d="M13 10h5v5h-5v-5Z M13 10L15.5 8.5l2.5 1.5v5L15.5 16.5l-2.5-1.5V10Z" transform="translate(-1,-1)"/>
      <path d="M15.5 8.5L13 10h5V8.5Z" opacity="0.7" transform="translate(-1,-1)"/>
      <path d="M13 11.5h1.5v2H13z" opacity="0.4" transform="translate(-1,-1)"/> {/* Window */}

      {/* Boom Arm */}
      <path d="M12.5 13L8 7l-1 1 4.5 6h1Z" />
      <path d="M12.5 13L8 7l.5-.5L12 12.5l.5.5Z" opacity="0.6"/>

      {/* Stick Arm */}
      <path d="M7.5 6.5L4 3l-1 1 3.5 3.5.5.5Z"/>
      <path d="M7.5 6.5L4 3l.5-.5L7 6l.5.5Z" opacity="0.6"/>
      
      {/* Bucket */}
      <path d="M3.5 2.5L7 5l-2 3H2l1.5-5.5Z"/>
      <path d="M3.5 2.5L2 8h1.5L5 5l2-2.5H3.5Z" opacity="0.7"/>
      <path d="M5 5l-.5 1h-2l.5-1Z" opacity="0.4"/> {/* Teeth hint */}
    </IconBase>
  );
};

export default ExcavatorIcon;
