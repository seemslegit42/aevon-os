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
  width = 28, // Default width
  height = 28, // Default height
}) => (
  <Image
    src="/aevon-logo.png" // Updated to use .png
    alt="Aevon OS Logo"
    width={width}
    height={height}
    className={className}
    priority // Useful for LCP elements like a logo
  />
);
