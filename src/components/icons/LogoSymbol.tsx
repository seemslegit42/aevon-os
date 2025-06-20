// src/components/icons/LogoSymbol.tsx
import React from 'react';
import Image from 'next/image';

interface LogoSymbolProps {
  className?: string;
  width?: number;
  height?: number;
}

export const LogoSymbol: React.FC<LogoSymbolProps> = ({
  className,
  width = 28, // Default width, similar to previous CommandIcon
  height = 28, // Default height, similar to previous CommandIcon
}) => (
  <Image
    src="/aevon-logo.svg" // Assumes 'aevon-logo.svg' is in the 'public' directory
    alt="Aevon OS Logo"
    width={width}
    height={height}
    className={className}
    priority // Useful for LCP elements like a logo
  />
);
