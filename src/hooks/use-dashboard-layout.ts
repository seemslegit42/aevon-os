
import { useState, useEffect, useCallback } from 'react';
import type { Position, Size } from 'react-rnd';
import type { CardConfig, CardLayoutInfo } from '@/config/dashboard-cards.config';
import { useToast } from "@/hooks/use-toast";
import { useDashboardStore } from '@/stores/dashboard.store';
import { useMicroAppStore } from '@/stores/micro-app.store';
import eventBus from '@/lib/event-bus';
import { ALL_MICRO_APPS } from '@/config/dashboard-cards.config';

const LAYOUT_STORAGE_KEY = 'dashboardCardLayouts_v4_minimal';
const ACTIVE_IDS_STORAGE_KEY = 'dashboardActiveCardIds_v4_minimal';

// Helper to check if a value is a valid, finite number
const isValidNumber = (value: any): value is number => typeof value === 'number' && isFinite(value);

export function useDashboardLayout(
  allCardConfigs: CardConfig[],
  defaultActiveCardIds: string[]
) {
  const { toast } = useToast();
  const [activeCardIds, setActiveCardIds] = useState<string[]>([]);
  const [cardLayouts, setCardLayouts] = useState<CardLayoutInfo[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { focusedCardId, setFocusedCardId } = useDashboardStore();
  const initializeApps = useMicroAppStore(state => state.initializeApps);

  // Effect for initializing state from localStorage and setting up listeners
  useEffect(() => {
    try {
      const savedLayoutsJSON = localStorage.getItem(LAYOUT_STORAGE_KEY);
      const savedActiveIdsJSON = localStorage.getItem(ACTIVE_IDS_STORAGE_KEY);

      // Determine active cards, filtering for only those that still exist in config
      let currentActiveIds = defaultActiveCardIds;
      if (savedActiveIdsJSON) {
        const parsedIds = JSON.parse(savedActiveIdsJSON);
        if (Array.isArray(parsedIds)) {
          const validIds = parsedIds.filter(id => typeof id === 'string' && allCardConfigs.some(c => c.id === id));
          if (validIds.length > 0) {
            currentActiveIds = validIds;
          }
        }
      }
      setActiveCardIds(currentActiveIds);

      // Build layouts safely by validating each property
      const savedLayouts = savedLayoutsJSON ? JSON.parse(savedLayoutsJSON) : [];
      const layoutsMap = new Map((Array.isArray(savedLayouts) ? savedLayouts : []).map((l: CardLayoutInfo) => [l.id, l]));

      const finalLayouts = currentActiveIds.map(id => {
        const defaultConfig = allCardConfigs.find(c => c.id === id)!;
        const savedConfig = layoutsMap.get(id);
        
        return {
          id: id,
          x: isValidNumber(savedConfig?.x) ? savedConfig.x : defaultConfig.defaultLayout.x,
          y: isValidNumber(savedConfig?.y) ? savedConfig.y : defaultConfig.defaultLayout.y,
          width: isValidNumber(savedConfig?.width) ? savedConfig.width : defaultConfig.defaultLayout.width,
          height: isValidNumber(savedConfig?.height) ? savedConfig.height : defaultConfig.defaultLayout.height,
          zIndex: isValidNumber(savedConfig?.zIndex) ? savedConfig.zIndex : defaultConfig.defaultLayout.zIndex,
        };
      });
      setCardLayouts(finalLayouts);

    } catch (error) {
      console.error("Error initializing dashboard from localStorage, resetting to default:", error);
      setActiveCardIds(defaultActiveCardIds);
      setCardLayouts(
        allCardConfigs
          .filter(config => defaultActiveCardIds.includes(config.id))
          .map(config => ({ id: config.id, ...config.defaultLayout }))
      );
      localStorage.removeItem(LAYOUT_STORAGE_KEY);
      localStorage.removeItem(ACTIVE_IDS_STORAGE_KEY);
    } finally {
      setIsInitialized(true);
    }

    // --- SETUP LOGIC MOVED FROM DASHBOARD COMPONENT ---
    // Initialize micro-apps, which includes registering them and hydrating their active state from localStorage.
    initializeApps(ALL_MICRO_APPS);

    // Listener for focusing a panel
    const focusPanel = (cardId: string) => {
      // Defer state updates slightly to avoid React update-during-render errors
      setTimeout(() => handleAddCard(cardId), 0);
    };
    eventBus.on('panel:focus', focusPanel);

    // Listener for submitting a command from the TopBar
    const handleCommand = (query: string) => {
       setTimeout(() => {
        if (!activeCardIds.includes('beep')) {
          handleAddCard('beep');
        } else {
          handleBringToFront('beep');
        }
        setTimeout(() => eventBus.emit('beep:submitQuery', query), 100);
      }, 0);
    };
    eventBus.on('command:submit', handleCommand);

    // Cleanup listeners on unmount
    return () => {
      eventBus.off('panel:focus', focusPanel);
      eventBus.off('command:submit', handleCommand);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only ONCE on mount.

  // Effect for persisting state to localStorage whenever it changes.
  useEffect(() => {
    if (!isInitialized) return;
    try {
      const layoutsToSave = cardLayouts.filter(l => activeCardIds.includes(l.id));
      localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(layoutsToSave));
      localStorage.setItem(ACTIVE_IDS_STORAGE_KEY, JSON.stringify(activeCardIds));
    } catch (error) {
      console.error("Failed to save dashboard state to localStorage:", error);
      toast({
        variant: "destructive",
        title: "Layout not saved",
        description: "Your dashboard layout changes could not be saved to local storage.",
      });
    }
  }, [cardLayouts, activeCardIds, isInitialized, toast]);

  const getMaxZIndex = useCallback(() => {
    if (cardLayouts.length === 0) return 0;
    return Math.max(0, ...cardLayouts.map(card => card.zIndex || 0));
  }, [cardLayouts]);

  const handleBringToFront = useCallback((id: string) => {
    setFocusedCardId(id);
    const maxZ = getMaxZIndex();
    setCardLayouts(prevLayouts =>
      prevLayouts.map(layout =>
        layout.id === id
          ? { ...layout, zIndex: maxZ + 1 }
          : layout
      )
    );
  }, [getMaxZIndex, setFocusedCardId]);

  const updateCardLayout = useCallback((id: string, newPos: Position, newSize?: Size) => {
    setCardLayouts(prevLayouts =>
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
    handleBringToFront(id); // Also bring to front on drag/resize
  }, [handleBringToFront]);

  const handleRemoveCard = useCallback((cardId: string) => {
    if (focusedCardId === cardId) {
        setFocusedCardId(null);
    }
    setActiveCardIds(prev => prev.filter(id => id !== cardId));
    toast({ title: "Zone Removed", description: `The zone has been removed from your dashboard.` });
  }, [toast, setFocusedCardId, focusedCardId]);

  const handleAddCard = useCallback((cardId: string) => {
    const cardConfig = allCardConfigs.find(c => c.id === cardId);
    if (!cardConfig) return;

    if (!activeCardIds.includes(cardId)) {
      setActiveCardIds(prev => [...prev, cardId]);
      setCardLayouts(prev => {
        const maxZ = Math.max(0, ...prev.map(l => l.zIndex || 0));
        const layoutExists = prev.some(l => l.id === cardId);
        if (layoutExists) {
            return prev.map(l => l.id === cardId ? { ...l, zIndex: maxZ + 1 } : l);
        }
        return [...prev, { ...cardConfig.defaultLayout, id: cardId, zIndex: maxZ + 1 }];
      });
      toast({ title: "Zone Added", description: `The zone "${cardConfig.title}" has been added.` });
    }
    handleBringToFront(cardId);
  }, [activeCardIds, allCardConfigs, handleBringToFront, toast]);

  const handleResetLayout = useCallback(() => {
    localStorage.removeItem(LAYOUT_STORAGE_KEY);
    localStorage.removeItem(ACTIVE_IDS_STORAGE_KEY);
    
    setFocusedCardId(null);
    setActiveCardIds([...defaultActiveCardIds]);
    setCardLayouts(
      allCardConfigs
        .filter(c => defaultActiveCardIds.includes(c.id))
        .map(c => ({ ...c.defaultLayout, id: c.id }))
    );
    toast({ title: "Layout Reset", description: "Dashboard layout has been reset to default." });
  }, [toast, allCardConfigs, defaultActiveCardIds, setFocusedCardId]);

  return {
    activeCardIds,
    cardLayouts,
    isInitialized,
    updateCardLayout,
    handleBringToFront,
    handleRemoveCard,
    handleAddCard,
    handleResetLayout,
  };
}
