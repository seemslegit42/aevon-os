
import { create } from 'zustand';
import type { Position, Size } from 'react-rnd';
import type { LayoutItem } from '@/config/dashboard-cards.config';
import { ALL_CARD_CONFIGS, ALL_MICRO_APPS, DEFAULT_LAYOUT_CONFIG } from '@/config/dashboard-cards.config';
import type { MicroApp } from './micro-app.store';

const LAYOUT_STORAGE_KEY = 'dashboardLayout_v5_unified';

interface LayoutState {
  layoutItems: LayoutItem[];
  isInitialized: boolean;
  initialize: () => void;
  updateItemLayout: (id: string, newPos: Position, newSize?: Size) => void;
  bringToFront: (id: string) => void;
  closeItem: (id: string) => void;
  addCard: (cardId: string) => string | undefined;
  launchApp: (app: MicroApp) => string;
  resetLayout: () => void;
}

const saveStateToLocalStorage = (state: LayoutItem[]) => {
  try {
    // A simple validation to prevent storing clearly invalid state
    if (Array.isArray(state)) {
      localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(state));
    }
  } catch (error) {
    console.error("Failed to save dashboard state to localStorage:", error);
  }
}

export const useLayoutStore = create<LayoutState>((set, get) => ({
  layoutItems: [],
  isInitialized: false,

  initialize: () => {
    if (get().isInitialized) return;

    try {
      const savedLayoutsJSON = localStorage.getItem(LAYOUT_STORAGE_KEY);
      let finalLayouts: LayoutItem[] = DEFAULT_LAYOUT_CONFIG;

      if (savedLayoutsJSON) {
        const parsedLayouts = JSON.parse(savedLayoutsJSON);
        if (Array.isArray(parsedLayouts)) {
          // Validate that the saved items still exist in our configs
          const validLayouts = parsedLayouts.filter(item => 
             item && typeof item.id === 'string' && typeof item.type === 'string' &&
             (item.type === 'card' ? ALL_CARD_CONFIGS.some(c => c.id === item.cardId) : ALL_MICRO_APPS.some(a => a.id === item.appId))
          );
           if (validLayouts.length > 0) {
              finalLayouts = validLayouts;
           }
        }
      }
      set({ layoutItems: finalLayouts });
    } catch (error) {
      console.error("Error initializing dashboard from localStorage, resetting to default:", error);
      set({ layoutItems: DEFAULT_LAYOUT_CONFIG });
      localStorage.removeItem(LAYOUT_STORAGE_KEY);
    } finally {
      set({ isInitialized: true });
    }
  },
  
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
    saveStateToLocalStorage(newItems);
    return { layoutItems: newItems };
  }),

  bringToFront: (id) => set(state => {
    const maxZ = state.layoutItems.length > 0 ? Math.max(0, ...state.layoutItems.map(item => item.zIndex || 0)) : 0;
    const newItems = state.layoutItems.map(layout =>
      layout.id === id
        ? { ...layout, zIndex: maxZ + 1 }
        : layout
    );
    saveStateToLocalStorage(newItems);
    return { layoutItems: newItems };
  }),

  closeItem: (itemId) => set(state => {
    const newItems = state.layoutItems.filter(item => item.id !== itemId);
    saveStateToLocalStorage(newItems);
    return { layoutItems: newItems };
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
    saveStateToLocalStorage(newItems);
    set({ layoutItems: newItems });
    return cardId;
  },

  launchApp: (app) => {
    const instanceId = `${app.id}-${Date.now()}`;
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
    saveStateToLocalStorage(newItems);
    set({ layoutItems: newItems });
    return instanceId;
  },

  resetLayout: () => {
    localStorage.removeItem(LAYOUT_STORAGE_KEY);
    set({ layoutItems: DEFAULT_LAYOUT_CONFIG, isInitialized: true });
  },
}));
