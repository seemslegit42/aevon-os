import React from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const FinancialReportIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 1.8;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline Financial Report Icon */}
      {/* Document Base */}
      <path d="M18 3H6C4.9 3 4 3.9 4 5v14c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-4-5Z"/>
      <path d="M18 3L20 8h-3.5c-.83 0-1.5-.67-1.5-1.5V3h3Z" opacity="0.7"/> {/* Folded corner */}
      <path d="M6 19.5V5h10v3.5c0 .28.22.5.5.5H18V16H6Z" opacity="0.3" fillRule="evenodd"/>

      {/* Mini Bar Chart Element (Crystalline) */}
      <path d="M8 10h1.5v4H8z M8 10L8.75 9.5l.75.5v4l-.75.5L8 14v-4Z" opacity="0.8"/>
      <path d="M10.5 12h1.5v2h-1.5z M10.5 12L11.25 11.5l.75.5v2l-.75.5L10.5 14v-2Z" opacity="0.8"/>
      <path d="M13 9h1.5v5H13z M13 9L13.75 8.5l.75.5v5l-.75.5L13 14V9Z" opacity="0.8"/>

      {/* Mini Pie Chart Element (Crystalline Slice) */}
      <path d="M10.5 17.5a2.5 2.5 0 1 0-5 0v-1.5h2.5A2.5 2.5 0 0 0 10.5 17.5Z" transform="translate(10, -1)" opacity="0.7"/>
      <path d="M8 16a2.5 2.5 0 0 1 2.5-2.5V16H8Z" transform="translate(10, -1)" opacity="0.5"/>
    </IconBase>
  );
};

export default FinancialReportIcon;
