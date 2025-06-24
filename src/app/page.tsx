
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

  return (
    <div className="h-full w-full relative" onClick={handleCanvasClick}>
      <WelcomeModal />
      <CommandPalette />
      {isMobile ? <MobileDashboard /> : <DesktopDashboard />}
    </div>
  );
};
