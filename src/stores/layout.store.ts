
import { create } from 'zustand';
import type { Position, Size } from 'react-rnd';
import type { LayoutItem } from '@/types/dashboard';
import { ALL_CARD_CONFIGS, ALL_MICRO_APPS, DEFAULT_LAYOUT_CONFIG } from '@/config/dashboard-cards.config';
import type { MicroApp } from './micro-app.store';

const LAYOUT_STORAGE_KEY = 'dashboardLayout_v6_repaired';

interface LayoutState {
  layoutItems: LayoutItem[];
  focusedItemId: string | null;
  isInitialized: boolean;
  initialize: () => void;
  setFocusedItemId: (id: string | null) => void;
  updateItemLayout: (id: string, newPos: Position, newSize?: Size) => void;
  bringToFront: (id: string) => void;
  closeItem: (id: string) => void;
  toggleMinimizeItem: (id: string) => void;
  addCard: (cardId: string) => string | undefined;
  launchApp: (app: MicroApp) => string;
  cloneApp: (appId: string) => string | undefined;
  closeAllInstancesOfApp: (appId: string) => boolean;
  focusLatestInstance: (appId: string) => boolean;
  moveItem: (itemId: string, newPos: Position) => void;
  resetLayout: () => void;
}

const saveStateToLocalStorage = (state: Pick<LayoutState, 'layoutItems' | 'focusedItemId'>) => {
  try {
    if (Array.isArray(state.layoutItems) && state.layoutItems.length > 0) {
      localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(state));
    } else {
      // If layout is empty, clear storage to allow reset on next load
      localStorage.removeItem(LAYOUT_STORAGE_KEY);
    }
  } catch (error) {
    console.error("Failed to save dashboard state to localStorage:", error);
  }
}

export const useLayoutStore = create<LayoutState>((set, get) => ({
  layoutItems: [],
  focusedItemId: null,
  isInitialized: false,

  initialize: () => {
    if (get().isInitialized) return;

    let finalState = {
        layoutItems: DEFAULT_LAYOUT_CONFIG,
        focusedItemId: null
    };

    try {
      const savedStateJSON = localStorage.getItem(LAYOUT_STORAGE_KEY);
      if (savedStateJSON) {
        const parsedState = JSON.parse(savedStateJSON);
        
        // Validate the loaded state to prevent chaos
        if (parsedState && Array.isArray(parsedState.layoutItems) && parsedState.layoutItems.length > 0) {
          const validLayouts = parsedState.layoutItems.filter((item: LayoutItem) => 
             item && typeof item.id === 'string' && typeof item.type === 'string' &&
             (item.type === 'card' 
                ? ALL_CARD_CONFIGS.some(c => c.id === item.cardId) 
                : ALL_MICRO_APPS.some(a => a.id === item.appId))
          );
          
          if(validLayouts.length > 0) {
            finalState.layoutItems = validLayouts;
            finalState.focusedItemId = validLayouts.some((item: LayoutItem) => item.id === parsedState.focusedItemId) ? parsedState.focusedItemId : null;
          }
        }
      }
    } catch (error) {
      console.error("Error initializing dashboard from localStorage, resetting to default:", error);
      finalState = { layoutItems: DEFAULT_LAYOUT_CONFIG, focusedItemId: null };
      localStorage.removeItem(LAYOUT_STORAGE_KEY);
    } finally {
      set({ ...finalState, isInitialized: true });
    }
  },
  
  setFocusedItemId: (id) => set(state => {
      const newState = { ...state, focusedItemId: id };
      saveStateToLocalStorage({ layoutItems: newState.layoutItems, focusedItemId: newState.focusedItemId });
      return { focusedItemId: id };
  }),

  updateItemLayout: (id, newPos, newSize) => set(state => {
    const newItems = state.layoutItems.map(layout =>
      layout.id === id
        ? {
            ...layout,
            x: newPos.x,
            y: newPos.y,
            width: newSize ? parseInt(String(newSize.width)) : layout.width,
            height: newSize ? parseInt(String(newSize.height)) : layout.height,
          }
        : layout
    );
    saveStateToLocalStorage({ layoutItems: newItems, focusedItemId: state.focusedItemId });
    return { layoutItems: newItems };
  }),

  bringToFront: (id) => set(state => {
    const maxZ = state.layoutItems.length > 0 ? Math.max(0, ...state.layoutItems.map(item => item.zIndex || 0)) : 0;
    const newItems = state.layoutItems.map(layout =>
      layout.id === id
        ? { ...layout, zIndex: maxZ + 1 }
        : layout
    );
    saveStateToLocalStorage({ layoutItems: newItems, focusedItemId: id });
    return { layoutItems: newItems, focusedItemId: id };
  }),

  closeItem: (itemId) => set(state => {
    const newItems = state.layoutItems.filter(item => item.id !== itemId);
    const newFocusedId = state.focusedItemId === itemId ? null : state.focusedItemId;
    saveStateToLocalStorage({ layoutItems: newItems, focusedItemId: newFocusedId });
    return { layoutItems: newItems, focusedItemId: newFocusedId };
  }),

  toggleMinimizeItem: (id) => set(state => {
    const newItems = state.layoutItems.map(item => {
      if (item.id === id) {
        const isNowMinimized = !item.isMinimized;
        if (isNowMinimized) {
          return {
            ...item,
            isMinimized: true,
            lastHeight: item.height,
            height: 44,
          };
        } else {
          const cardConfig = item.type === 'card' ? ALL_CARD_CONFIGS.find(c => c.id === item.cardId) : null;
          const appConfig = item.type === 'app' ? ALL_MICRO_APPS.find(a => a.id === item.appId) : null;
          const defaultHeight = cardConfig ? cardConfig.minHeight : (appConfig ? appConfig.defaultSize.height : 200);

          return {
            ...item,
            isMinimized: false,
            height: item.lastHeight || defaultHeight,
            lastHeight: undefined,
          };
        }
      }
      return item;
    });
    saveStateToLocalStorage({ layoutItems: newItems, focusedItemId: state.focusedItemId });
    return { layoutItems: newItems };
  }),

  addCard: (cardId) => {
    const currentItems = get().layoutItems;
    if (currentItems.some(item => item.id === cardId)) {
        get().bringToFront(cardId);
        return cardId;
    }

    const cardConfig = ALL_CARD_CONFIGS.find(c => c.id === cardId);
    if (!cardConfig) return undefined;

    const maxZ = currentItems.length > 0 ? Math.max(0, ...currentItems.map(item => item.zIndex || 0)) : 0;
    const newCard: LayoutItem = {
        id: cardId,
        type: 'card',
        cardId: cardId,
        ...cardConfig.defaultLayout,
        zIndex: maxZ + 1,
    }
    set(state => {
      const newItems = [...state.layoutItems, newCard];
      saveStateToLocalStorage({ layoutItems: newItems, focusedItemId: cardId });
      return { layoutItems: newItems, focusedItemId: cardId };
    });
    return cardId;
  },

  launchApp: (app) => {
    const instanceId = `${app.id}-${crypto.randomUUID()}`;
    const currentItems = get().layoutItems;
    const maxZ = currentItems.length > 0 ? Math.max(0, ...currentItems.map(item => item.zIndex || 0)) : 0;
    const existingAppWindows = currentItems.filter(item => item.type === 'app' && item.appId === app.id);
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
    
    set(state => {
      const newItems = [...state.layoutItems, newAppWindow];
      saveStateToLocalStorage({ layoutItems: newItems, focusedItemId: instanceId });
      return { layoutItems: newItems, focusedItemId: instanceId };
    });
    return instanceId;
  },

  cloneApp: (appId) => {
    const currentItems = get().layoutItems;
    const openInstances = currentItems.filter(item => item.type === 'app' && item.appId === appId);

    if (openInstances.length === 0) return undefined;

    const sourceInstance = openInstances.reduce((latest, current) => 
        (current.zIndex > latest.zIndex ? current : latest)
    );
    
    const instanceId = `${appId}-${crypto.randomUUID()}`;
    const maxZ = Math.max(0, ...currentItems.map(item => item.zIndex || 0));
    
    const newAppWindow: LayoutItem = {
        id: instanceId,
        type: 'app',
        appId: sourceInstance.appId,
        x: sourceInstance.x + 30,
        y: sourceInstance.y + 30,
        width: sourceInstance.width,
        height: sourceInstance.height,
        zIndex: maxZ + 1,
    };

    set(state => {
      const newItems = [...state.layoutItems, newAppWindow];
      saveStateToLocalStorage({ layoutItems: newItems, focusedItemId: instanceId });
      return { layoutItems: newItems, focusedItemId: instanceId };
    });
    return instanceId;
  },

  closeAllInstancesOfApp: (appId) => {
    const currentItems = get().layoutItems;
    const itemsToKeep = currentItems.filter(item => !(item.type === 'app' && item.appId === appId));
    
    if (itemsToKeep.length === currentItems.length) return false; // Nothing was removed

    set(state => {
        const newFocusedId = state.focusedItemId && itemsToKeep.some(i => i.id === state.focusedItemId) ? state.focusedItemId : null;
        saveStateToLocalStorage({ layoutItems: itemsToKeep, focusedItemId: newFocusedId });
        return { layoutItems: itemsToKeep, focusedItemId: newFocusedId };
    });
    return true;
  },

  focusLatestInstance: (appId: string) => {
    const instances = get().layoutItems.filter(item => item.type === 'app' && item.appId === appId);
    if (instances.length > 0) {
        const latestInstance = instances.reduce((latest, current) => (current.zIndex > latest.zIndex ? current : latest));
        get().bringToFront(latestInstance.id);
        return true;
    }
    return false;
  },

  moveItem: (itemId, newPos) => {
    set(state => {
      const newItems = state.layoutItems.map(item => 
        item.id === itemId ? { ...item, x: newPos.x, y: newPos.y } : item
      );
      saveStateToLocalStorage({ layoutItems: newItems, focusedItemId: itemId });
      return { layoutItems: newItems, focusedItemId: itemId };
    });
    get().bringToFront(itemId);
  },

  resetLayout: () => {
    const defaultState = {
        layoutItems: DEFAULT_LAYOUT_CONFIG,
        focusedItemId: null
    }
    localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(defaultState));
    set({ ...defaultState, isInitialized: true });
  },
}));
