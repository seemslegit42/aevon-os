import React from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const AccountingIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 1.8;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline Accounting Icon (Calculator + Ledger) */}
      {/* Background Ledger Page */}
      <path d="M5 2.5h14v19H5v-19Z" opacity="0.15"/>
      <path d="M5 2.5L12 1l7 1.5v19l-7 1.5-7-1.5v-19Z" opacity="0.1"/>
      <path d="M6 4h12M6 8h12M6 12h12M6 16h6" stroke="currentColor" strokeWidth={sw*0.2} opacity="0.3"/>

      {/* Calculator Body */}
      <path d="M11 5.5h8v13h-8v-13Z" transform="translate(-2, 0)"/>
      <path d="M11 5.5L15 4l4 1.5v13l-4 1.5-4-1.5v-13Z" opacity="0.7" transform="translate(-2, 0)"/>

      {/* Calculator Screen */}
      <path d="M10 7h6v3h-6V7Z" opacity="0.8" transform="translate(-2, 0)"/>
      
      {/* Calculator Buttons */}
      <rect x="7.5" y="11" width="1.5" height="1.5" rx=".25" opacity="0.6"/>
      <rect x="10" y="11" width="1.5" height="1.5" rx=".25" opacity="0.6"/>
      <rect x="12.5" y="11" width="1.5" height="1.5" rx=".25" opacity="0.6"/>
      <rect x="7.5" y="13.5" width="1.5" height="1.5" rx=".25" opacity="0.6"/>
      <rect x="10" y="13.5" width="1.5" height="1.5" rx=".25" opacity="0.6"/>
      <rect x="12.5" y="13.5" width="1.5" height="1.5" rx=".25" opacity="0.6"/>
    </IconBase>
  );
};

export default AccountingIcon;
