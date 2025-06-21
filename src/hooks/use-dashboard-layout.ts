
import { useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useMicroAppStore, type MicroApp } from '@/stores/micro-app.store';
import eventBus from '@/lib/event-bus';
import { ALL_MICRO_APPS, ALL_CARD_CONFIGS } from '@/config/dashboard-cards.config';
import { useLayoutStore } from '@/stores/layout.store';
import type { Position, Size } from 'react-rnd';

/**
 * This hook acts as a controller for the dashboard layout. It consumes the layout state from a centralized
 * Zustand store (`useLayoutStore`) and orchestrates side-effects like event bus communication and toasts.
 * It provides a stable API for components to interact with the dashboard layout.
 */
export function useDashboardLayout() {
  const { toast } = useToast();
  
  // Consume state and actions from the global layout store
  const {
    layoutItems,
    isInitialized,
    initialize,
    updateItemLayout: updateStoreLayout,
    bringToFront,
    closeItem,
    addCard,
    launchApp,
    cloneApp,
    resetLayout,
    setFocusedItemId,
  } = useLayoutStore();

  const initializeApps = useMicroAppStore(state => state.initializeApps);

  const handleBringToFront = useCallback((id: string) => {
    setFocusedItemId(id);
    bringToFront(id);
  }, [bringToFront, setFocusedItemId]);

  const updateItemLayout = useCallback((id: string, newPos: Position, newSize?: Size) => {
    updateStoreLayout(id, newPos, newSize);
    handleBringToFront(id); // Moving or resizing should bring the item to the front
  }, [updateStoreLayout, handleBringToFront]);

  const handleCloseItem = useCallback((itemId: string) => {
    closeItem(itemId);
    toast({ title: "Item Closed", description: `The window has been removed from your dashboard.` });
  }, [closeItem, toast]);

  const handleAddCard = useCallback((cardId: string) => {
    const { layoutItems: currentItems } = useLayoutStore.getState(); // Get fresh state
    const cardExists = currentItems.some(item => item.id === cardId);
    
    addCard(cardId);
    handleBringToFront(cardId);

    if (!cardExists) {
        const cardConfig = ALL_CARD_CONFIGS.find(c => c.id === cardId);
        if (cardConfig) {
            toast({ title: "Zone Added", description: `The zone "${cardConfig.title}" has been added.` });
        }
    }
  }, [addCard, handleBringToFront, toast]);

  const handleLaunchApp = useCallback((app: MicroApp) => {
    const newInstanceId = launchApp(app);
    handleBringToFront(newInstanceId);
    toast({ title: "App Launched", description: `Launched "${app.title}".` });
  }, [launchApp, handleBringToFront, toast]);

  const handleCloneApp = useCallback((appId: string) => {
    const newInstanceId = cloneApp(appId);
    if (newInstanceId) {
        handleBringToFront(newInstanceId);
        toast({ title: "Instance Cloned", description: "A new window instance has been created." });
    } else {
        toast({ variant: "destructive", title: "Clone Failed", description: "No open instance available to clone." });
    }
  }, [cloneApp, handleBringToFront, toast]);
  
  const handleResetLayout = useCallback(() => {
    resetLayout();
    toast({ title: "Layout Reset", description: "Dashboard layout has been reset to default." });
  }, [resetLayout, toast]);

  const handleCloseAllAppInstances = useCallback((appId: string) => {
    const { layoutItems: currentItems, closeItem: close } = useLayoutStore.getState();
    const instancesToClose = currentItems.filter(item => item.type === 'app' && item.appId === appId);
    if (instancesToClose.length > 0) {
        instancesToClose.forEach(instance => close(instance.id));
        toast({ title: "App Closed", description: `Closed all instances of ${appId}.` });
    } else {
        toast({ variant: 'destructive', title: "Not Found", description: `No open instances of ${appId} to close.` });
    }
  }, [toast]);

  const handleFocusLatestAppInstance = useCallback((appId: string) => {
      const { layoutItems: currentItems } = useLayoutStore.getState();
      const instances = currentItems.filter(item => item.type === 'app' && item.appId === appId);
      if (instances.length > 0) {
          const latestInstance = instances.reduce((latest, current) => (current.zIndex > latest.zIndex ? current : latest));
          handleBringToFront(latestInstance.id);
      } else {
          toast({ variant: 'destructive', title: "Not Found", description: `No open instance of ${appId} to focus.` });
      }
  }, [toast, handleBringToFront]);

  const handleMoveItem = useCallback(({ itemId, x, y }: { itemId: string; x: number; y: number; }) => {
    updateItemLayout(itemId, { x, y });
    toast({ title: "Item Moved", description: `Item has been moved to a new position.` });
  }, [updateItemLayout, toast]);

  // Effect for initialization and event bus setup
  useEffect(() => {
    initialize();
    initializeApps(ALL_MICRO_APPS);

    const handleCommand = (query: string) => {
       handleAddCard('beep');
       setTimeout(() => eventBus.emit('beep:submitQuery', query), 100);
    };

    // Event Bus Listeners
    eventBus.on('panel:focus', handleBringToFront);
    eventBus.on('panel:add', handleAddCard);
    eventBus.on('panel:remove', handleCloseItem);
    eventBus.on('layout:reset', handleResetLayout);
    eventBus.on('app:launch', handleLaunchApp);
    eventBus.on('app:clone', handleCloneApp);
    eventBus.on('command:submit', handleCommand);
    eventBus.on('app:closeAll', handleCloseAllAppInstances);
    eventBus.on('app:focusLatest', handleFocusLatestAppInstance);
    eventBus.on('item:move', handleMoveItem);

    return () => {
      eventBus.off('panel:focus', handleBringToFront);
      eventBus.off('panel:add', handleAddCard);
      eventBus.off('panel:remove', handleCloseItem);
      eventBus.off('layout:reset', handleResetLayout);
      eventBus.off('app:launch', handleLaunchApp);
      eventBus.off('app:clone', handleCloneApp);
      eventBus.off('command:submit', handleCommand);
      eventBus.off('app:closeAll', handleCloseAllAppInstances);
      eventBus.off('app:focusLatest', handleFocusLatestAppInstance);
      eventBus.off('item:move', handleMoveItem);
    };
  }, [initialize, initializeApps, handleBringToFront, handleAddCard, handleCloseItem, handleResetLayout, handleLaunchApp, handleCloneApp, handleCloseAllAppInstances, handleFocusLatestAppInstance, handleMoveItem]);

  // Expose the state and the composed controller functions
  return {
    layoutItems,
    isInitialized,
    updateItemLayout,
    handleBringToFront,
    closeItem: handleCloseItem,
  };
}
