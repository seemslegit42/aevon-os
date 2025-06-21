
import { create } from 'zustand';
import type { Position, Size } from 'react-rnd';
import type { LayoutItem } from '@/config/dashboard-cards.config';
import { ALL_CARD_CONFIGS, ALL_MICRO_APPS, DEFAULT_LAYOUT_CONFIG } from '@/config/dashboard-cards.config';
import type { MicroApp } from './micro-app.store';

const LAYOUT_STORAGE_KEY = 'dashboardLayout_v5_unified';

interface LayoutState {
  layoutItems: LayoutItem[];
  focusedItemId: string | null;
  isInitialized: boolean;
  initialize: () => void;
  setFocusedItemId: (id: string | null) => void;
  updateItemLayout: (id: string, newPos: Position, newSize?: Size) => void;
  bringToFront: (id: string) => void;
  closeItem: (id: string) => void;
  addCard: (cardId: string) => string | undefined;
  launchApp: (app: MicroApp) => string;
  cloneApp: (appId: string) => string | undefined;
  resetLayout: () => void;
}

const saveStateToLocalStorage = (state: Pick<LayoutState, 'layoutItems' | 'focusedItemId'>) => {
  try {
    // A simple validation to prevent storing clearly invalid state
    if (Array.isArray(state.layoutItems)) {
      localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(state));
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

    try {
      const savedStateJSON = localStorage.getItem(LAYOUT_STORAGE_KEY);
      let finalState = {
          layoutItems: DEFAULT_LAYOUT_CONFIG,
          focusedItemId: null
      };

      if (savedStateJSON) {
        const parsedState = JSON.parse(savedStateJSON);
        if (parsedState && Array.isArray(parsedState.layoutItems)) {
          // Validate that the saved items still exist in our configs
          const validLayouts = parsedState.layoutItems.filter(item => 
             item && typeof item.id === 'string' && typeof item.type === 'string' &&
             (item.type === 'card' ? ALL_CARD_CONFIGS.some(c => c.id === item.cardId) : ALL_MICRO_APPS.some(a => a.id === item.appId))
          );
          
          finalState.layoutItems = validLayouts;
          // also restore focused item if it's still valid
          finalState.focusedItemId = validLayouts.some(item => item.id === parsedState.focusedItemId) ? parsedState.focusedItemId : null;
        }
      }
      set(finalState);
    } catch (error) {
      console.error("Error initializing dashboard from localStorage, resetting to default:", error);
      set({ layoutItems: DEFAULT_LAYOUT_CONFIG, focusedItemId: null });
      localStorage.removeItem(LAYOUT_STORAGE_KEY);
    } finally {
      set({ isInitialized: true });
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

  addCard: (cardId) => {
    const currentItems = get().layoutItems;
    // Prevent duplicates
    if (currentItems.some(item => item.id === cardId)) {
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
    const newItems = [...currentItems, newCard];
    set(state => {
        saveStateToLocalStorage({ layoutItems: newItems, focusedItemId: state.focusedItemId });
        return { layoutItems: newItems };
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
    
    const newItems = [...currentItems, newAppWindow];
    set(state => {
        saveStateToLocalStorage({ layoutItems: newItems, focusedItemId: state.focusedItemId });
        return { layoutItems: newItems };
    });
    return instanceId;
  },

  cloneApp: (appId) => {
    const currentItems = get().layoutItems;
    const openInstances = currentItems.filter(item => item.type === 'app' && item.appId === appId);

    if (openInstances.length === 0) {
        return undefined; // No instance to clone
    }

    // Find the instance with the highest zIndex (most recently focused)
    const sourceInstance = openInstances.reduce((latest, current) => 
        (current.zIndex > latest.zIndex ? current : latest)
    );
    
    const instanceId = `${appId}-${crypto.randomUUID()}`;
    const maxZ = Math.max(0, ...currentItems.map(item => item.zIndex || 0));
    
    // Create a new window by cloning properties from the source
    const newAppWindow: LayoutItem = {
        id: instanceId,
        type: 'app',
        appId: sourceInstance.appId,
        x: sourceInstance.x + 30, // Stagger the clone
        y: sourceInstance.y + 30,
        width: sourceInstance.width,
        height: sourceInstance.height,
        zIndex: maxZ + 1,
    };

    const newItems = [...currentItems, newAppWindow];
    set(state => {
        saveStateToLocalStorage({ layoutItems: newItems, focusedItemId: state.focusedItemId });
        return { layoutItems: newItems };
    });
    return instanceId;
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
