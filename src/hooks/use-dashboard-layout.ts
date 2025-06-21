
import { useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { MicroApp } from '@/stores/micro-app.store';
import eventBus from '@/lib/event-bus';
import { ALL_CARD_CONFIGS, ALL_MICRO_APPS } from '@/config/dashboard-cards.config';
import { useLayoutStore } from '@/stores/layout.store';

/**
 * This hook acts as a central controller for the dashboard layout. It initializes the layout
 * and sets up all event bus listeners. It translates events from other parts of the app
 * (like the AI agent) into state changes in the centralized Zustand store.
 * This encapsulates side-effect logic and keeps the rest of the component tree clean.
 */
export function useDashboardLayout() {
  const { toast } = useToast();
  
  // Get actions directly from the store.
  const {
    initialize,
    bringToFront,
    addCard,
    closeItem,
    resetLayout,
    launchApp,
    cloneApp,
    closeAllInstancesOfApp,
    focusLatestInstance,
    moveItem,
  } = useLayoutStore.getState();

  const handleLaunchAppWithToast = useCallback((app: MicroApp) => {
      const newInstanceId = launchApp(app);
      bringToFront(newInstanceId);
      toast({ title: "App Launched", description: `Launched "${app.title}".` });
  }, [launchApp, bringToFront, toast]);

  const handleAddCardWithToast = useCallback((cardId: string) => {
    const { layoutItems } = useLayoutStore.getState();
    const cardExists = layoutItems.some(item => item.id === cardId);
    
    const instanceId = addCard(cardId);
    if(instanceId) bringToFront(instanceId);

    if (!cardExists) {
        const cardConfig = ALL_CARD_CONFIGS.find(c => c.id === cardId);
        if (cardConfig) {
            toast({ title: "Zone Added", description: `The zone "${cardConfig.title}" has been added.` });
        }
    }
  }, [addCard, bringToFront, toast]);

  const handleCloseItemWithToast = useCallback((itemId: string) => {
    closeItem(itemId);
    toast({ title: "Item Closed", description: `The window has been removed from your dashboard.` });
  }, [closeItem, toast]);
  
  const handleResetLayoutWithToast = useCallback(() => {
    resetLayout();
    toast({ title: "Layout Reset", description: "Dashboard layout has been reset to default." });
  }, [resetLayout, toast]);

  const handleCloneAppWithToast = useCallback((appId: string) => {
      const newInstanceId = cloneApp(appId);
      if (newInstanceId) {
          bringToFront(newInstanceId);
          toast({ title: "Instance Cloned", description: "A new window instance has been created." });
      } else {
          toast({ variant: "destructive", title: "Clone Failed", description: "No open instance available to clone." });
      }
  }, [cloneApp, bringToFront, toast]);

  const handleCloseAllWithToast = useCallback((appId: string) => {
    const app = ALL_MICRO_APPS.find(a => a.id === appId);
    const success = closeAllInstancesOfApp(appId);
     if (success) {
        toast({ title: "App Closed", description: `Closed all instances of ${app?.title || 'the app'}.` });
    } else {
        toast({ variant: 'destructive', title: "Not Found", description: `No open instances of that app to close.` });
    }
  }, [closeAllInstancesOfApp, toast]);

  const handleFocusLatestWithToast = useCallback((appId: string) => {
      const success = focusLatestInstance(appId);
      if (!success) {
          toast({ variant: 'destructive', title: "Not Found", description: `No open instance of that app to focus.` });
      }
  }, [focusLatestInstance, toast]);

  const handleMoveItemWithToast = useCallback(({ itemId, x, y }: { itemId: string; x: number; y: number; }) => {
    moveItem(itemId, {x, y});
    toast({ title: "Item Moved", description: `Item has been moved to a new position.` });
  }, [moveItem, toast]);

  const handleCommand = useCallback((query: string) => {
    // Ensure the BEEP panel is open before submitting a query to it
    const { layoutItems } = useLayoutStore.getState();
    const beepExists = layoutItems.some(item => item.id === 'beep');
    if (!beepExists) {
        const instanceId = addCard('beep');
        if(instanceId) bringToFront(instanceId);
    } else {
        bringToFront('beep');
    }
    // Give the UI a moment to respond before sending the event
    setTimeout(() => eventBus.emit('beep:submitQuery', query), 50);
  }, [addCard, bringToFront]);

  // This effect runs once on mount to initialize the dashboard and set up all event listeners.
  useEffect(() => {
    initialize();

    eventBus.on('panel:focus', bringToFront);
    eventBus.on('panel:add', handleAddCardWithToast);
    eventBus.on('panel:remove', handleCloseItemWithToast);
    eventBus.on('layout:reset', handleResetLayoutWithToast);
    eventBus.on('app:launch', handleLaunchAppWithToast);
    eventBus.on('app:clone', handleCloneAppWithToast);
    eventBus.on('command:submit', handleCommand);
    eventBus.on('app:closeAll', handleCloseAllWithToast);
    eventBus.on('app:focusLatest', handleFocusLatestWithToast);
    eventBus.on('item:move', handleMoveItemWithToast);

    return () => {
      eventBus.off('panel:focus', bringToFront);
      eventBus.off('panel:add', handleAddCardWithToast);
      eventBus.off('panel:remove', handleCloseItemWithToast);
      eventBus.off('layout:reset', handleResetLayoutWithToast);
      eventBus.off('app:launch', handleLaunchAppWithToast);
      eventBus.off('app:clone', handleCloneAppWithToast);
      eventBus.off('command:submit', handleCommand);
      eventBus.off('app:closeAll', handleCloseAllWithToast);
      eventBus.off('app:focusLatest', handleFocusLatestWithToast);
      eventBus.off('item:move', handleMoveItemWithToast);
    };
  }, [
      initialize, bringToFront, handleAddCardWithToast, handleCloseItemWithToast, handleResetLayoutWithToast, 
      handleLaunchAppWithToast, handleCloneAppWithToast, handleCloseAllWithToast, handleFocusLatestWithToast, 
      handleMoveItemWithToast, handleCommand
  ]);

  // This hook doesn't need to return anything as it's a controller.
  // UI components will select their state directly from the store.
}
