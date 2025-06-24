
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
import { DesktopDashboard } from '@/components/desktop-dashboard';
import { MobileDashboard } from '@/components/mobile-dashboard';

export default function HomePage() {
  const [hasMounted, setHasMounted] = useState(false);
  const isMobile = useIsMobile();

  const {
    setFocusedItemId,
    checkAndInitializeLayout,
  } = useLayoutStore(
    (state) => ({
      setFocusedItemId: state.setFocusedItemId,
      checkAndInitializeLayout: state.checkAndInitializeLayout,
    }),
    shallow
  );

  useEffect(() => {
    // This effect now correctly handles initialization after rehydration.
    checkAndInitializeLayout();
    setHasMounted(true);
  }, [checkAndInitializeLayout]);

  useEffect(() => {
    if (hasMounted) {
        const handleFocus = (id: string) => {
            useLayoutStore.getState().bringToFront(id);
        };
        eventBus.on('panel:focus', handleFocus);
        
        // Add initial system notification if none exist
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
    }
  }, [hasMounted]);

  
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If the click is on the direct canvas background, unfocus all items
    if (e.target === e.currentTarget) {
        setFocusedItemId(null);
    }
  };

  if (!hasMounted) {
    const skeletonItems = isMobile ? 4 : 8;
    return (
        <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(skeletonItems)].map((_, i) => (
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

  return (
    <div className="h-full w-full relative" onClick={handleCanvasClick}>
      <WelcomeModal />
      <CommandPalette />
      {isMobile ? <MobileDashboard /> : <DesktopDashboard />}
    </div>
  );
};
