
import React from 'react';
import IconBase, { ICON_GRADIENT_ID } from '../IconBase';
import { IconProps } from '../../types';

const BackupRecoveryIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 1.8;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline Backup & Recovery Icon */}
      {/* Archive Box Base */}
      <path d="M4 8h16v10H4V8Zm0 0L12 6l8 2v10l-8 2-8-2V8Z"/>
      <path d="M12 6L4 8h16L12 6Z" opacity="0.7"/> {/* Lid top */}
      <path d="M4 18h16V10H4v8Z" opacity="0.1"/> {/* Box front shading */}

      {/* Crystalline Circular Refresh Arrow */}
      <path d="M16.5 7.5a4.5 4.5 0 1 0-3.18 1.32L12.5 7V9.5h2.5l-1.5-1.5A4.49 4.49 0 0 0 16.5 7.5Z" transform="translate(0, -2)" fill="currentColor" opacity="0.9"/>
      <path d="M16.5 3a4.5 4.5 0 0 1-1.32 3.18L16.5 7.5V5h-2.5l1.5-1.5A4.49 4.49 0 0 1 16.5 3Z" transform="translate(0, -2)" fill="currentColor" opacity="0.6"/>
      <path d="M13.32 4.32A4.5 4.5 0 0 1 12 7.5L13.5 9h-2.5V6.5l1.5 1.5A4.49 4.49 0 0 0 13.32 4.32Z" transform="translate(0, -2)" fill="currentColor" opacity="0.4"/>
    </IconBase>
  );
};

export default BackupRecoveryIcon;
