
import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const FileIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Main document body */}
      <path d="M14.5 2H6C4.9 2 4 2.9 4 4v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V7.5L14.5 2Z"/>
      {/* Folded Corner (Dog-Ear) */}
      <path d="M14 2v5.5h5.5L14 2Z" opacity="0.7"/>
    </IconBase>
  );
});
FileIcon.displayName = 'FileIcon';

export default FileIcon;
