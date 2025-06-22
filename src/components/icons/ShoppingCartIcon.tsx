
import React, { forwardRef } from 'react';
import IconBase from '../IconBase';
import { IconProps } from '../../types';

const ShoppingCartIcon = forwardRef<SVGSVGElement, IconProps>(({ className, size, strokeWidth, id }, ref) => {
  return (
    <IconBase ref={ref} id={id} className={className} width={size} height={size} strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {/* Cart Body and Handle */}
      <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM17 18c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zM1 2h3.27l.94 2H20c.83 0 1.5.67 1.5 1.5 0 .25-.08.48-.19.68L17.6 11.2c-.15.28-.44.48-.78.48H7.14l-.94-2H18V6H5.76l-.94-2H1V2zm4.25 11h8.92l2.63-5H6.11l-1.86 5z"/>
      {/* Basket highlight */}
      <path d="M5.25 13L1 4h1.76L6.11 8l10.24.01L19.5 4.5c.04-.08.05-.16.05-.25 0-.07-.01-.13-.03-.19L18.1 2H5.21l-.94-2H1v2h1.54z" opacity="0.5"/>
    </IconBase>
  );
});
ShoppingCartIcon.displayName = 'ShoppingCartIcon';

export default ShoppingCartIcon;
