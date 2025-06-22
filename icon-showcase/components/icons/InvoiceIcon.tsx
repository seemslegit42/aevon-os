import React from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const InvoiceIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Crystalline Invoice Icon */}
      {/* Document Shape */}
      <path d="M18 3H6C4.9 3 4 3.9 4 5v14c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-4-5Z"/>
      <path d="M18 3L20 8h-3.5c-.83 0-1.5-.67-1.5-1.5V3h3Z" opacity="0.75"/> {/* Folded corner */}
      <path d="M6 19.5V5h10v3.5c0 .28.22.5.5.5H18V15.5H6Z" opacity="0.35" fillRule="evenodd"/> {/* Content area shadow */}
      
      {/* Currency Symbol (Dollar-like, faceted) */}
      <path d="M12 11h-1v1.25c0 .69-.56 1.25-1.25 1.25S8.5 12.94 8.5 12.25 9.06 11 9.75 11h1.5V9.75H9.75c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25h1V13.5c0 .69.56 1.25 1.25 1.25s1.25-.56 1.25-1.25S13.06 12.25 12.25 12.25h-1.5V11H12.25c.69 0 1.25-.56 1.25-1.25S12.94 8.5 12.25 8.5H12v2.5Z"/>
      <path d="M10.5 9v8M9.85 9L10.5 8.35l.65.65v8l-.65.65L10.5 17.65V9Z" opacity="0.85"/>
      
      {/* Line items (subtle) */}
      <path d="M7.5 12h1.5M7.5 14.5h1.5" strokeWidth={strokeWidth ? strokeWidth*0.5 : 1} stroke="currentColor" strokeLinecap="round" opacity="0.45"/>
    </IconBase>
  );
};

export default InvoiceIcon;