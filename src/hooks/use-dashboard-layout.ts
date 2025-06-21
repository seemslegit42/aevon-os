
import { useState, useEffect, useCallback } from 'react';
import type { Position, Size } from 'react-rnd';
import type { CardConfig, LayoutItem } from '@/config/dashboard-cards.config';
import { useToast } from "@/hooks/use-toast";
import { useDashboardStore } from '@/stores/dashboard.store';
import { useMicroAppStore, type MicroApp } from '@/stores/micro-app.store';
import eventBus from '@/lib/event-bus';
import { ALL_MICRO_APPS, ALL_CARD_CONFIGS, DEFAULT_LAYOUT_CONFIG } from '@/config/dashboard-cards.config';

const LAYOUT_STORAGE_KEY = 'dashboardLayout_v5_unified';

// Helper to check if a value is a valid, finite number
const isValidNumber = (value: any): value is number => typeof value === 'number' && isFinite(value);

export function useDashboardLayout() {
  const { toast } = useToast();
  const [layoutItems, setLayoutItems] = useState<LayoutItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { focusedCardId, setFocusedCardId } = useDashboardStore();
  const initializeApps = useMicroAppStore(state => state.initializeApps);

  // Effect for initializing state from localStorage and setting up listeners
  useEffect(() => {
    try {
      const savedLayoutsJSON = localStorage.getItem(LAYOUT_STORAGE_KEY);
      let finalLayouts: LayoutItem[] = DEFAULT_LAYOUT_CONFIG;

      if (savedLayoutsJSON) {
        const parsedLayouts = JSON.parse(savedLayoutsJSON);
        if (Array.isArray(parsedLayouts)) {
          // Basic validation for saved layouts
          const validLayouts = parsedLayouts.filter(item => 
             item && typeof item.id === 'string' && typeof item.type === 'string' &&
             (item.type === 'card' ? ALL_CARD_CONFIGS.some(c => c.id === item.cardId) : ALL_MICRO_APPS.some(a => a.id === item.appId))
          );
           if (validLayouts.length > 0) {
              finalLayouts = validLayouts;
           }
        }
      }
      setLayoutItems(finalLayouts);

    } catch (error) {
      console.error("Error initializing dashboard from localStorage, resetting to default:", error);
      setLayoutItems(DEFAULT_LAYOUT_CONFIG);
      localStorage.removeItem(LAYOUT_STORAGE_KEY);
    } finally {
      setIsInitialized(true);
    }

    initializeApps(ALL_MICRO_APPS);

    // Listener for submitting a command from the TopBar
    const handleCommand = (query: string) => {
       setTimeout(() => {
        let beepItem = layoutItems.find(item => item.type === 'card' && item.cardId === 'beep');
        if (!beepItem) {
          addCard('beep');
        } else {
          handleBringToFront('beep');
        }
        setTimeout(() => eventBus.emit('beep:submitQuery', query), 100);
      }, 0);
    };
    eventBus.on('command:submit', handleCommand);

    return () => {
      eventBus.off('command:submit', handleCommand);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only ONCE on mount.

  // Effect for persisting state to localStorage whenever it changes.
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(layoutItems));
    } catch (error) {
      console.error("Failed to save dashboard state to localStorage:", error);
      toast({
        variant: "destructive",
        title: "Layout not saved",
        description: "Your dashboard layout changes could not be saved to local storage.",
      });
    }
  }, [layoutItems, isInitialized, toast]);

  const getMaxZIndex = useCallback(() => {
    if (layoutItems.length === 0) return 0;
    return Math.max(0, ...layoutItems.map(item => item.zIndex || 0));
  }, [layoutItems]);

  const handleBringToFront = useCallback((id: string) => {
    setFocusedCardId(id);
    const maxZ = getMaxZIndex();
    setLayoutItems(prevLayouts =>
      prevLayouts.map(layout =>
        layout.id === id
          ? { ...layout, zIndex: maxZ + 1 }
          : layout
      )
    );
  }, [getMaxZIndex, setFocusedCardId]);

  const updateItemLayout = useCallback((id: string, newPos: Position, newSize?: Size) => {
    setLayoutItems(prevLayouts =>
      prevLayouts.map(layout =>
        layout.id === id
          ? {
              ...layout,
              x: newPos.x,
              y: newPos.y,
              width: newSize ? parseInt(String(newSize.width)) : layout.width,
              height: newSize ? parseInt(String(newSize.height)) : layout.height,
            }
          : layout
      )
    );
    handleBringToFront(id);
  }, [handleBringToFront]);

  const closeItem = useCallback((itemId: string) => {
    if (focusedCardId === itemId) {
        setFocusedCardId(null);
    }
    setLayoutItems(prev => prev.filter(item => item.id !== itemId));
    toast({ title: "Item Closed", description: `The window has been removed from your dashboard.` });
  }, [toast, setFocusedCardId, focusedCardId]);

  const addCard = useCallback((cardId: string) => {
    const cardConfig = ALL_CARD_CONFIGS.find(c => c.id === cardId);
    if (!cardConfig) return;

    if (!layoutItems.some(item => item.id === cardId)) {
        const maxZ = getMaxZIndex();
        const newCard: LayoutItem = {
            id: cardId,
            type: 'card',
            cardId: cardId,
            ...cardConfig.defaultLayout,
            zIndex: maxZ + 1,
        }
      setLayoutItems(prev => [...prev, newCard]);
      toast({ title: "Zone Added", description: `The zone "${cardConfig.title}" has been added.` });
    }
    handleBringToFront(cardId);
  }, [layoutItems, getMaxZIndex, handleBringToFront, toast]);
  
  const launchApp = useCallback((app: MicroApp) => {
    const instanceId = `${app.id}-${Date.now()}`;
    const maxZ = getMaxZIndex();

    // Stagger new windows slightly to prevent perfect overlap
    const existingAppWindows = layoutItems.filter(item => item.type === 'app' && item.appId === app.id);
    const staggerOffset = (existingAppWindows.length % 5) * 30;

    const newAppWindow: LayoutItem = {
        id: instanceId,
        type: 'app',
        appId: app.id,
        x: 480 + staggerOffset,
        y: 310 + staggerOffset,
        width: app.defaultSize.width,
        height: app.defaultSize.height,
        zIndex: maxZ + 1
    };

    setLayoutItems(prev => [...prev, newAppWindow]);
    handleBringToFront(instanceId);
    toast({ title: "App Launched", description: `Launched "${app.title}".` });

  }, [getMaxZIndex, handleBringToFront, layoutItems, toast]);

  const handleResetLayout = useCallback(() => {
    localStorage.removeItem(LAYOUT_STORAGE_KEY);
    setFocusedCardId(null);
    setLayoutItems(DEFAULT_LAYOUT_CONFIG);
    toast({ title: "Layout Reset", description: "Dashboard layout has been reset to default." });
  }, [toast, setFocusedCardId]);

  return {
    layoutItems,
    isInitialized,
    updateItemLayout,
    handleBringToFront,
    closeItem,
    addCard,
    launchApp,
    handleResetLayout,
  };
}
