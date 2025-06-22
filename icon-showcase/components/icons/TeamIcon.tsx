import React from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const TeamIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Crystalline Team Icon */}
      {/* Central Figure */}
      <path d="M12 5.5a2.75 2.75 0 1 0 0 5.5 2.75 2.75 0 0 0 0-5.5Z M12 12.5c-2.5 0-7.5 1.25-7.5 3.75v1.75h15V16.25c0-2.5-5-3.75-7.5-3.75Z"/>
      <path d="M12 5.5L10.75 7l1.25 1.25L13.25 7 12 5.5Z" opacity="0.75"/> {/* Head facet */}
      <path d="M4.5 16.25L12 13.5l7.5 2.75v1.75H4.5v-1.75Z" opacity="0.55"/> {/* Body facet */}

      {/* Left Figure (slightly smaller, partially overlapped) */}
      <path d="M7.5 7.5a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5Z M7.5 13c-1.8 0-4.5.8-4.5 2.25v1.25h6V15.25c0-1.45-2.7-2.25-4.5-2.25Z" opacity="0.85"/>
      <path d="M7.5 7.5L6.75 8.5l.75.75.75-.75-.75-.75Z" opacity="0.55"/>
      <path d="M3 15.25L7.5 13.5l3 1.15v1.1H3v-.5Z" opacity="0.35"/>

      {/* Right Figure (slightly smaller, partially overlapped) */}
      <path d="M16.5 7.5a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5Z M16.5 13c1.8 0 4.5.8 4.5 2.25v1.25h-6V15.25c0-1.45 2.7-2.25 4.5-2.25Z" opacity="0.85"/>
      <path d="M16.5 7.5L15.75 8.5l.75.75.75-.75-.75-.75Z" opacity="0.55"/>
      <path d="M21 15.25L16.5 13.5l-3 1.15v1.1H21v-.5Z" opacity="0.35"/>
    </IconBase>
  );
};

export default TeamIcon;