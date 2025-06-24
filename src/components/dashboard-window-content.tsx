
"use client";

import React, { Suspense, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { componentMap } from '@/lib/component-map';
import { ALL_CARD_CONFIGS, ALL_MICRO_APPS } from '@/config/app-registry';
import { useLayoutStore } from '@/stores/layout.store';
import { shallow } from 'zustand/shallow';

interface WindowContentProps {
  isMinimized?: boolean;
  itemId: string;
}

export const WindowContent: React.FC<WindowContentProps> = ({ isMinimized, itemId }) => {
  if (isMinimized) {
    return null; // Don't render content if the window is minimized
  }

  // Find the layout item from the store to determine its type and content ID
  const item = useLayoutStore(state => state.layoutItems.find(i => i.id === itemId), shallow);

  const ContentDetails = useMemo(() => {
    if (!item) return null;

    const componentId = item.type === 'card' ? item.cardId : item.appId;
    if (!componentId) return null;

    const ContentComponent = componentMap.get(componentId);
    if (!ContentComponent) return null;

    const config = item.type === 'card'
      ? ALL_CARD_CONFIGS.find(c => c.id === componentId)
      : ALL_MICRO_APPS.find(a => a.id === componentId);
      
    const contentProps = config && 'contentProps' in config ? config.contentProps : {};

    return { ContentComponent, contentProps };
  }, [item]);


  if (!item || !ContentDetails) {
    return (
      <div className="p-4">
        <p className="text-destructive">Error: Could not load content for item ID: {itemId}</p>
      </div>
    );
  }

  const { ContentComponent, contentProps } = ContentDetails;
  
  return (
    <Suspense fallback={<div className="p-4"><Skeleton className="h-full w-full" /></div>}>
      <ContentComponent {...contentProps} />
    </Suspense>
  );
};
