
import { useState, useEffect, useCallback } from 'react';
import type { Position, Size } from 'react-rnd';
import type { CardConfig, CardLayoutInfo } from '@/config/dashboard-cards.config';
import { useToast } from "@/hooks/use-toast";

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

  // Effect for initializing state from localStorage, runs only once on mount.
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
        
        // Build a safe layout, falling back to the default for any invalid or missing properties
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
      // If any part of loading/parsing fails, reset to a clean default state.
      setActiveCardIds(defaultActiveCardIds);
      setCardLayouts(
        allCardConfigs
          .filter(config => defaultActiveCardIds.includes(config.id))
          .map(config => ({ id: config.id, ...config.defaultLayout }))
      );
      // Clear potentially corrupted storage to prevent future errors
      localStorage.removeItem(LAYOUT_STORAGE_KEY);
      localStorage.removeItem(ACTIVE_IDS_STORAGE_KEY);
    } finally {
      setIsInitialized(true);
    }
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
              zIndex: getMaxZIndex() + 1,
            }
          : layout
      )
    );
  }, [getMaxZIndex]);

  const handleBringToFront = useCallback((id: string) => {
    setCardLayouts(prevLayouts =>
      prevLayouts.map(layout =>
        layout.id === id
          ? { ...layout, zIndex: getMaxZIndex() + 1 }
          : layout
      )
    );
  }, [getMaxZIndex]);

  const handleRemoveCard = useCallback((cardId: string) => {
    setActiveCardIds(prev => prev.filter(id => id !== cardId));
    toast({ title: "Zone Removed", description: `The zone has been removed from your dashboard.` });
  }, [toast]);

  const handleAddCard = useCallback((cardId: string) => {
    const cardConfig = allCardConfigs.find(c => c.id === cardId);
    if (!cardConfig) return;

    if (!activeCardIds.includes(cardId)) {
      setActiveCardIds(prev => [...prev, cardId]);
      if (!cardLayouts.some(l => l.id === cardId)) {
        setCardLayouts(prev => [...prev, { ...cardConfig.defaultLayout, id: cardId, zIndex: getMaxZIndex() + 1 }]);
      }
      handleBringToFront(cardId);
      toast({ title: "Zone Added", description: `The zone "${cardConfig.title}" has been added.` });
    } else {
      handleBringToFront(cardId);
    }
  }, [activeCardIds, cardLayouts, getMaxZIndex, handleBringToFront, toast, allCardConfigs]);

  const handleResetLayout = useCallback(() => {
    // Clear storage first for a clean reset
    localStorage.removeItem(LAYOUT_STORAGE_KEY);
    localStorage.removeItem(ACTIVE_IDS_STORAGE_KEY);
    
    // Reset state to defaults
    setActiveCardIds([...defaultActiveCardIds]);
    setCardLayouts(
      allCardConfigs
        .filter(c => defaultActiveCardIds.includes(c.id))
        .map(c => ({ ...c.defaultLayout, id: c.id }))
    );
    toast({ title: "Layout Reset", description: "Dashboard layout has been reset to default." });
  }, [toast, allCardConfigs, defaultActiveCardIds]);

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
