
import { useState, useEffect, useCallback } from 'react';
import type { Position, Size } from 'react-rnd';
import type { CardConfig, CardLayoutInfo } from '@/config/dashboard-cards.config';
import { useToast } from "@/hooks/use-toast";

const LAYOUT_STORAGE_KEY = 'dashboardCardLayouts_v4_minimal';
const ACTIVE_IDS_STORAGE_KEY = 'dashboardActiveCardIds_v4_minimal';

export function useDashboardLayout(
  allCardConfigs: CardConfig[],
  defaultActiveCardIds: string[]
) {
  const { toast } = useToast();
  const [activeCardIds, setActiveCardIds] = useState<string[]>([]);
  const [cardLayouts, setCardLayouts] = useState<CardLayoutInfo[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedLayouts = localStorage.getItem(LAYOUT_STORAGE_KEY);
    const savedActiveIds = localStorage.getItem(ACTIVE_IDS_STORAGE_KEY);

    let currentActiveIds = [...defaultActiveCardIds];
    if (savedActiveIds) {
      try {
        const parsedActiveIds = JSON.parse(savedActiveIds) as string[];
        // Filter to ensure only valid card IDs are loaded
        currentActiveIds = parsedActiveIds.filter(id => allCardConfigs.some(c => c.id === id));
        if (currentActiveIds.length === 0 && allCardConfigs.length > 0) {
          currentActiveIds = [...defaultActiveCardIds];
        }
      } catch (e) {
        console.error("Failed to parse active card IDs from localStorage", e);
        currentActiveIds = [...defaultActiveCardIds];
      }
    }
    setActiveCardIds(currentActiveIds);

    let initialLayouts: CardLayoutInfo[] = [];
    if (savedLayouts) {
      try {
        const parsedLayouts = JSON.parse(savedLayouts) as CardLayoutInfo[];
        initialLayouts = currentActiveIds.map(id => {
          const existingLayout = parsedLayouts.find(l => l.id === id);
          if (existingLayout) return existingLayout;
          const defaultConfig = allCardConfigs.find(c => c.id === id);
          return defaultConfig ? { ...defaultConfig.defaultLayout, id } : null;
        }).filter(Boolean) as CardLayoutInfo[];
      } catch (e) {
        console.error("Failed to parse layouts from localStorage", e);
        initialLayouts = allCardConfigs
          .filter(c => currentActiveIds.includes(c.id))
          .map(c => ({ ...c.defaultLayout, id: c.id }));
      }
    } else {
      initialLayouts = allCardConfigs
        .filter(c => currentActiveIds.includes(c.id))
        .map(c => ({ ...c.defaultLayout, id: c.id }));
    }
    setCardLayouts(initialLayouts);
    setIsInitialized(true);
  }, [allCardConfigs, defaultActiveCardIds]);

  useEffect(() => {
    if (!isInitialized) return;
    const layoutsToSave = cardLayouts.filter(l => activeCardIds.includes(l.id));
    localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(layoutsToSave));
  }, [cardLayouts, activeCardIds, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem(ACTIVE_IDS_STORAGE_KEY, JSON.stringify(activeCardIds));
  }, [activeCardIds, isInitialized]);

  const getMaxZIndex = useCallback(() => {
    if (cardLayouts.length === 0) return 0;
    return Math.max(0, ...cardLayouts.map(card => card.zIndex || 0).filter(z => typeof z === 'number'));
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
    // Optional: Remove layout info for the card if desired, or let it persist if re-added
    // setCardLayouts(prev => prev.filter(l => l.id !== cardId)); 
    toast({ title: "Zone Removed", description: `The zone has been removed from your dashboard.` });
  }, [toast]);

  const handleAddCard = useCallback((cardId: string) => {
    const cardConfig = allCardConfigs.find(c => c.id === cardId);
    if (!cardConfig) return;

    if (!activeCardIds.includes(cardId)) {
      setActiveCardIds(prev => [...prev, cardId]);
      if (!cardLayouts.find(l => l.id === cardId)) {
        setCardLayouts(prev => [...prev, { ...cardConfig.defaultLayout, id: cardId, zIndex: getMaxZIndex() + 1 }]);
      } else {
        // If layout exists but card was inactive, just bring it to front
        handleBringToFront(cardId);
      }
      toast({ title: "Zone Added", description: `The zone "${cardConfig.title}" has been added.` });
    } else {
      // If card is already active, just bring it to front
      handleBringToFront(cardId);
    }
  }, [activeCardIds, cardLayouts, getMaxZIndex, handleBringToFront, toast, allCardConfigs]);

  const handleResetLayout = useCallback(() => {
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
    getMaxZIndex, // Exposing this if needed by the page directly, e.g. for initial zIndex
  };
}
