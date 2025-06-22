
"use client";

import React, { useEffect } from 'react';
import CommandPalette from '@/components/command-palette';
import { useLayoutStore } from '@/stores/layout.store';
import { Skeleton } from '@/components/ui/skeleton';
import DashboardWindow from '@/components/dashboard-window';
import { shallow } from 'zustand/shallow';
import { ALL_CARD_CONFIGS, ALL_MICRO_APPS } from '@/config/dashboard-cards.config';
import eventBus from '@/lib/event-bus';

export default function HomePage() {
  useEffect(() => {
    // Initialize the layout store which loads from localStorage or defaults.
    useLayoutStore.getState().initialize();

    // Listen for global focus events, e.g., from notifications
    const handleFocus = (id: string) => {
        useLayoutStore.getState().bringToFront(id);
    };
    eventBus.on('panel:focus', handleFocus);

    return () => {
        // Clean up the event listener on unmount
        eventBus.off('panel:focus', handleFocus);
    }
  }, []);

  const {
    layoutItems,
    isInitialized,
    focusedItemId,
    setFocusedItemId
  } = useLayoutStore(
    (state) => ({
      layoutItems: state.layoutItems,
      isInitialized: state.isInitialized,
      focusedItemId: state.focusedItemId,
      setFocusedItemId: state.setFocusedItemId,
    }),
    shallow
  );
  
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
        setFocusedItemId(null);
    }
  };

  if (!isInitialized) {
    return (
        <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                    <Skeleton className="h-[125px] w-full rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                    </div>
                </div>
            ))}
        </div>
    );
  }

  return (
    <div className="h-full w-full relative" onClick={handleCanvasClick}>
      {layoutItems.map(item => {
          const config = item.type === 'card'
            ? ALL_CARD_CONFIGS.find(c => c.id === item.cardId)
            : ALL_MICRO_APPS.find(a => a.id === item.appId);
          
          if (!config) return null;

          return (
              <DashboardWindow
                key={item.id}
                item={item}
                config={config}
                isFocused={item.id === focusedItemId}
              />
          );
      })}
       <CommandPalette />
    </div>
  );
};
