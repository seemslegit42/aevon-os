
import React from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const AutonomousDecisionIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 1.8;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline Autonomous Decision Icon */}
      {/* AI Brain Base (similar to AIBrainIcon but perhaps simpler) */}
      <path d="M12 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z M12 6.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" />
      <path d="M12 5L9.5 7.5h5L12 5Z" opacity="0.6"/>
      <path d="M9.5 7.5c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5V7.5Z" opacity="0.4"/>
      <path d="M14.5 7.5c1.5 0 2.5 1 2.5 2.5s-1 2.5-2.5 2.5V7.5Z" opacity="0.4"/>

      {/* Decision Pathway / Arrow Emerging */}
      <path d="M12 13v4.5l-2.5 2.5h5L12 17.5V13Z" /> {/* Arrow Tail + Point */}
      <path d="M12 13l-1.5 1.5h3L12 13Z" opacity="0.7"/> {/* Arrow shaft facet */}
      <path d="M9.5 17.5l2.5 2.5V17.5H9.5Z" opacity="0.5"/> {/* Arrowhead side facet */}
      <path d="M14.5 17.5l-2.5 2.5V17.5h2.5Z" opacity="0.5"/> {/* Arrowhead side facet */}

      {/* Subtle radiating lines from brain suggesting thought process */}
      <path d="M8 7L6 5M16 7L18 5M7 10H4M17 10h3" 
            strokeWidth={sw * 0.3} strokeLinecap="round" stroke="currentColor" opacity="0.2" fill="none"/>
    </IconBase>
  );
};

export default AutonomousDecisionIcon;
