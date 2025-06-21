
"use client";

import React, { Suspense, type LazyExoticComponent } from 'react';
import type { LayoutItem } from '@/types/dashboard';
import { ALL_CARD_CONFIGS, ALL_MICRO_APPS } from '@/config/dashboard-cards.config';
import { Skeleton } from '@/components/ui/skeleton';

interface WindowContentProps {
  item: LayoutItem;
}

/**
 * This component is responsible for rendering the correct content
 * inside a dashboard window based on the item's type ('card' or 'app').
 * It handles the logic of finding the correct component and props,
 * and wraps the content in a Suspense boundary for lazy loading.
 */
export const WindowContent: React.FC<WindowContentProps> = ({ item }) => {
  let ContentComponent: LazyExoticComponent<React.ComponentType<any>> | null = null;
  let contentProps: any = {};

  if (item.type === 'card') {
    const cardConfig = ALL_CARD_CONFIGS.find(c => c.id === item.cardId);
    if (cardConfig) {
        ContentComponent = cardConfig.content;
        contentProps = { ...cardConfig.contentProps };
    }
  } else { // 'app'
    const appConfig = ALL_MICRO_APPS.find(a => a.id === item.appId);
    if (appConfig) {
        ContentComponent = appConfig.component;
    }
  }
  
  if (!ContentComponent) return null;

  return (
    <Suspense fallback={<div className="p-4"><Skeleton className="h-full w-full" /></div>}>
      {!item.isMinimized && <ContentComponent {...contentProps} />}
    </Suspense>
  );
};
