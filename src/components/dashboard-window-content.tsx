
"use client";

import React, { Suspense, type LazyExoticComponent, type ElementType } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface WindowContentProps {
  isMinimized?: boolean;
  ContentComponent: LazyExoticComponent<ElementType>;
  contentProps?: any;
}

/**
 * This component is responsible for rendering the correct content
 * inside a dashboard window based on the item's type ('card' or 'app').
 * It handles the logic of finding the correct component and props,
 * and wraps the content in a Suspense boundary for lazy loading.
 */
export const WindowContent: React.FC<WindowContentProps> = ({ isMinimized, ContentComponent, contentProps }) => {
  if (isMinimized) {
    return null; // Don't render content if the window is minimized
  }
  
  return (
    <Suspense fallback={<div className="p-4"><Skeleton className="h-full w-full" /></div>}>
      <ContentComponent {...contentProps} />
    </Suspense>
  );
};
