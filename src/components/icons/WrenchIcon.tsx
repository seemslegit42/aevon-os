import React from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const WrenchIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Main wrench shape */}
      <path d="M22.7 14.3c-.8-.8-2.1-.8-2.9 0l-2.1 2.1c-1.6-1.1-3.5-1.6-5.4-1.5V10c.9-.6 1.5-1.7 1.5-2.8C13.8 5.3 12 3.5 10.1 3.5S6.4 5.3 6.4 7.2c0 1.1.6 2.1 1.5 2.8v4.3c-1.9.1-3.8.6-5.4 1.5L.4 18c-.8.8-.8 2.1 0 2.9.8.8 2.1.8 2.9 0l2.1-2.1c1.6 1.1 3.5 1.6 5.4 1.5V25h2.8v-4.3c1.9-.1 3.8-.6 5.4-1.5l2.1 2.1c.8.8 2.1.8 2.9 0 .8-.8.8-2.1 0-2.9l-2.1-2.1c.8-1.5 1-3.2.3-4.8zM8.2 10c0-.5.4-1 1-1s1 .4 1 1v1H8.2v-1zm3.7 10.9c-2.7.3-5.2-1-6.5-3.2l8.6-8.6c2.2 1.3 3.5 3.8 3.2 6.5l-1.5 1.5c-.5.5-1.2.5-1.7 0l-1.2-1.2c-.5-.5-1.2-.5-1.7 0l-1.2 1.2c-.4.5-.4 1.1 0 1.6l1.5 1.5c.5.5 1.1.5 1.6 0l.1-.1z"/>
      {/* Head highlight */}
      <path d="M22.7 14.3l-2.1-2.1c.8-1.5 1-3.2.3-4.8L18.8 5.3c-.8-.8-2.1-.8-2.9 0l-1.8 1.8c-.5-.3-1.1-.5-1.7-.5C10.7 6.6 9 8.1 9 10v.8L2.8 17c-.8.8-.8 2.1 0 2.9l.1.1c.8.8 2.1.8 2.9 0l6.2-6.2V15c0 1.7 1.5 3.2 3.2 3.2.6 0 1.1-.2 1.6-.5l1.8 1.8c.8.8 2.1.8 2.9 0l2.1-2.1c.8-.8.8-2.1 0-2.9z" opacity="0.5"/>
    </IconBase>
  );
};

export default WrenchIcon;
