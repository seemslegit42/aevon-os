
"use client";

import React, { useState, useEffect } from 'react';
import { useLayoutStore } from '@/stores/layout.store';
import { useNotificationStore } from '@/stores/notification.store';
import { Skeleton } from '@/components/ui/skeleton';
import { shallow } from 'zustand/shallow';
import eventBus from '@/lib/event-bus';
import { WelcomeModal } from '@/components/welcome-modal';
import CommandPalette from '@/components/command-palette';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import DashboardWindow from '@/components/dashboard-window';
import MicroAppCard from '@/components/micro-app-card';
import { WindowContent } from '@/components/dashboard-window-content';
import { Card } from '@/components/ui/card';
import { ALL_CARD_CONFIGS, ALL_MICRO_APPS } from '@/config/app-registry';


export default function HomePage() {
  const isMobile = useIsMobile();

  const {
    layoutItems,
    focusedItemId,
    setFocusedItemId,
    checkAndInitializeLayout,
  } = useLayoutStore(
    (state) => ({
      layoutItems: state.layoutItems,
      focusedItemId: state.focusedItemId,
      setFocusedItemId: state.setFocusedItemId,
      checkAndInitializeLayout: state.checkAndInitializeLayout,
    }),
    shallow
  );

  useEffect(() => {
    checkAndInitializeLayout();
  }, [checkAndInitializeLayout]);

  useEffect(() => {
    // This effect only runs once on the client after checkAndInitializeLayout has run
    const handleFocus = (id: string) => {
        useLayoutStore.getState().bringToFront(id);
    };
    eventBus.on('panel:focus', handleFocus);
    
    const { notifications, addNotification } = useNotificationStore.getState();
    if (notifications.length === 0) {
        addNotification({
            task: "System Initialized",
            status: "success",
            details: "Live Orchestration Feed is active. Waiting for AI events.",
            targetId: "liveOrchestrationFeed"
        });
    }
    
    return () => {
        eventBus.off('panel:focus', handleFocus);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
        setFocusedItemId(null);
    }
  };

  // While waiting for the client-side check, show a generic skeleton.
  if (isMobile === undefined) {
    return (
        <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                    <Skeleton className="h-[125px] w-full rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full md:w-[250px]" />
                        <Skeleton className="h-4 w-5/6 md:w-[200px]" />
                    </div>
                </div>
            ))}
        </div>
    );
  }

  // Mobile View
  if (isMobile) {
    const sortedItems = [...layoutItems].sort((a, b) => {
        const order = ['liveOrchestrationFeed', 'beep', 'aiInsights', 'agentPresence'];
        const indexA = a.cardId ? order.indexOf(a.cardId) : order.length;
        const indexB = b.cardId ? order.indexOf(b.cardId) : order.length;
        if (a.type === 'app') return 1;
        if (b.type === 'app') return -1;
        return indexA - indexB;
    });

    return (
        <div className="p-4 space-y-4">
            <WelcomeModal />
            <CommandPalette />
            {sortedItems.map(item => {
                if (item.isMinimized) return null;
                
                const config = item.type === 'card'
                    ? ALL_CARD_CONFIGS.find(c => c.id === item.cardId)
                    : ALL_MICRO_APPS.find(a => a.id === item.appId);

                if (!config) {
                    return (
                        <Card key={item.id} className="p-4 bg-destructive text-destructive-foreground">
                            <p>Error: Component config not found for "{item.cardId || item.appId}".</p>
                        </Card>
                    );
                }

                return (
                    <div key={item.id}>
                        <MicroAppCard
                            title={config.title}
                            icon={config.icon}
                            actions={null}
                            controls={undefined}
                        >
                            <WindowContent itemId={item.id} />
                        </MicroAppCard>
                    </div>
                );
            })}
        </div>
    );
  }

  // Desktop View
  return (
    <div className={cn("w-full relative h-full")} onClick={handleCanvasClick}>
      <WelcomeModal />
      <CommandPalette />
      {layoutItems.map(item => (
        <DashboardWindow
            key={item.id}
            item={item}
            isFocused={item.id === focusedItemId}
        />
      ))}
    </div>
  );
};
