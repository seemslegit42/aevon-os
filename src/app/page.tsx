
"use client";

import React, { useState, useEffect } from 'react';
import { useLayoutStore } from '@/stores/layout.store';
import { useNotificationStore } from '@/stores/notification.store';
import { Skeleton } from '@/components/ui/skeleton';
import DashboardWindow from '@/components/dashboard-window';
import { shallow } from 'zustand/shallow';
import eventBus from '@/lib/event-bus';
import { WelcomeModal } from '@/components/welcome-modal';

export default function HomePage() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);

    const handleFocus = (id: string) => {
        useLayoutStore.getState().bringToFront(id);
    };
    eventBus.on('panel:focus', handleFocus);

    return () => {
        eventBus.off('panel:focus', handleFocus);
    }
  }, []);

  useEffect(() => {
    if (hasMounted) {
      const { notifications, addNotification } = useNotificationStore.getState();
      if (notifications.length === 0) {
          addNotification({
              task: "System Initialized",
              status: "success",
              details: "Live Orchestration Feed is active. Waiting for AI events.",
              targetId: "liveOrchestrationFeed"
          });
      }
    }
  }, [hasMounted]);

  const {
    layoutItems,
    focusedItemId,
    setFocusedItemId
  } = useLayoutStore(
    (state) => ({
      layoutItems: state.layoutItems,
      focusedItemId: state.focusedItemId,
      setFocusedItemId: state.setFocusedItemId,
    }),
    shallow
  );
  
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If the click is on the direct canvas background, unfocus all items
    if (e.target === e.currentTarget) {
        setFocusedItemId(null);
    }
  };

  if (!hasMounted) {
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
      <WelcomeModal />
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
