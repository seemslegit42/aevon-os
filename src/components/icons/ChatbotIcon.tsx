import React from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const ChatbotIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Crystalline Chatbot Icon */}
      {/* Speech Bubble Outline */}
      <path d="M20 3H4C3.17 3 2.5 3.67 2.5 4.5v11c0 .83.67 1.5 1.5 1.5h1.5v2.5l3.25-2.5H20c.83 0 1.5-.67 1.5-1.5v-11C21.5 3.67 20.83 3 20 3Z"/>
      <path d="M20 3L12 1.5 4 3V4.5c0 .28.22.5.5.5h15c.28 0 .5-.22.5-.5V4.5C21.5 3.67 20.83 3 20 3Z" opacity="0.55"/>
      <path d="M5.5 17H7v2.5l3.25-2.5H10V15.5H5.66l-1.41 1.8V17H2.5V4.5L4 3.5h16L21.5 5v10l-1.5 1.5H10.5l-2.3 2.3V17H5.5v-.5Z" opacity="0.25" fillRule="evenodd"/>
      
      {/* AI Motif (Simplified Neural Net inside bubble) */}
      {/* Central Node */}
      <circle cx="12" cy="9.5" r="1.5" opacity="0.75"/>
      <path d="M12 8L11.25 9l.75.75.75-.75L12 8Z" opacity="0.45"/>

      {/* Connecting Nodes/Lines */}
      <path d="M9.75 7.75a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z" opacity="0.65"/>
      <path d="M14.25 7.75a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z" opacity="0.65"/>
      <path d="M9.75 11.25a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z" opacity="0.65"/>
      <path d="M14.25 11.25a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z" opacity="0.65"/>

      <path d="M10.4 8.4L11.5 9.25M13.6 8.4L12.5 9.25M10.4 10.6L11.5 9.75M13.6 10.6L12.5 9.75" 
            strokeWidth={strokeWidth ? strokeWidth * 0.35 : 0.7} strokeLinecap="round" stroke="currentColor" opacity="0.55" fill="none"/>
    </IconBase>
  );
};

export default ChatbotIcon;
