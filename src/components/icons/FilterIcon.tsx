// src/components/icons/FilterIcon.tsx
import React from 'react';
import { IconProps } from '../../../config';

export const FilterIcon: React.FC<IconProps> = ({ className, size = 20, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 256 256" 
    className={className} 
    fill="currentColor" // Changed to currentColor for fill
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Opacity layer for subtle background if needed, often not used directly if currentColor is used */}
    {/* <path d="M232,48H24A8,8,0,0,0,21,58.3l69.1,81.4a8.3,8.3,0,0,1,2.9,6V224a8,8,0,0,0,12.9,6.3l32-40A8,8,0,0,0,144,184V145.7a8.3,8.3,0,0,1,2.9-6L215,58.3A8,8,0,0,0,208,48Z" opacity="0.1" fill="currentColor"/> */}
    <path d="M232,56H24a7.9,7.9,0,0,0-5.5,13.5L84,135v65a7.9,7.9,0,0,0,4.6,7.2,8.1,8.1,0,0,0,8.4-.2l32-32A8,8,0,0,0,132,168V135l65.5-65.5A7.9,7.9,0,0,0,232,56Zm-16,16L156,132.2a15.7,15.7,0,0,0-4.6,11.3v35l-24,24V143.5a15.7,15.7,0,0,0-4.6-11.3L60,72Z" fill="currentColor"/>
  </svg>
);
// Note: The original SVG had lines and paths with stroke. Phosphor icons typically use fill.
// This is a conversion attempt. The line elements were converted to path equivalents for fill.
// If a pure stroke version is preferred for consistency with *some* other icons, then the original path was:
// <line x1="24" y1="48" x2="232" y2="48" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
// <path d="M21,58.3,90.1,139.7a8.3,8.3,0,0,0,2.9,6V224a8,8,0,0,0,12.9,6.3l32-40A8,8,0,0,0,144,184V145.7a8.3,8.3,0,0,0,2.9-6L215,58.3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
// For the filled version:
// <path d="M232,56H24a7.9,7.9,0,0,0-5.5,13.5L84,135v65a7.9,7.9,0,0,0,4.6,7.2,8.1,8.1,0,0,0,8.4-.2l32-32A8,8,0,0,0,132,168V135l65.5-65.5A7.9,7.9,0,0,0,232,56Zm-16,16L156,132.2a15.7,15.7,0,0,0-4.6,11.3v35l-24,24V143.5a15.7,15.7,0,0,0-4.6-11.3L60,72Z"/>
// The provided filled path is a common representation of a filter icon.
