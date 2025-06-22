import React from 'react';
import IconBase, { ICON_GRADIENT_ID } from '../IconBase';
import { IconProps } from '../../types';

const CaduceusIcon: React.FC<IconProps> = ({ className, size, strokeWidth }) => {
  const sw = strokeWidth || 1.8;
  return (
    <IconBase className={className} width={size} height={size} strokeWidth={sw} viewBox="0 0 24 24">
      {/* Crystalline Caduceus Icon - Refined */}
      {/* Staff */}
      <path d="M12 2v20M11.35 2L12 1.25l.65.75v20l-.65.75L12 22.75V2Z" opacity="0.9"/>
      <path d="M12 2L11 3.5h2L12 2Z" opacity="0.75"/> {/* Top of staff */}
      <path d="M12 22L11 20.5h2L12 22Z" opacity="0.75"/> {/* Bottom of staff */}

      {/* Wings */}
      <path d="M12 6.5C9.75 6 8 4.5 8 3h1c.55 0 1 .45 1 1s-.45 1-1 1c.85 1 1.88 1.5 3 1.5Z"/>
      <path d="M12 6.5C14.25 6 16 4.5 16 3h-1c-.55 0-1 .45-1 1s.45 1 1 1c-.85 1-1.88 1.5-3 1.5Z"/>
      <path d="M8 3L12 6.5l4-3.5H8Z" opacity="0.55"/> {/* Wing Facet */}

      {/* Serpents (using stroke with gradient) */}
      <path d="M11 20.5s-3-2.5-3-5.5c0-2.25 1.8-4 3.25-4s3.25 1.75 3.25 4c0 3-3 5.5-3 5.5" 
            fill="none" stroke={`url(#${ICON_GRADIENT_ID})`} strokeWidth={sw * 1.1} strokeLinecap="round" />
      <path d="M13 20.5s3-2.5 3-5.5c0-2.25-1.8-4-3.25-4S9.5 12.75 9.5 15c0 3 3 5.5 3 5.5" 
            fill="none" stroke={`url(#${ICON_GRADIENT_ID})`} strokeWidth={sw * 1.1} strokeLinecap="round" />
      
      {/* Serpent head facets (filled) */}
      <path d="M8.25 10l-.6.6.6.6.6-.6-.6-.6Z" opacity="0.95"/>
      <path d="M15.75 10l-.6.6.6.6.6-.6-.6-.6Z" opacity="0.95"/>
    </IconBase>
  );
};

export default CaduceusIcon;
