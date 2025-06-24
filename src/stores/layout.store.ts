
"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Position, Size } from 'react-rnd';
import type { LayoutItem } from '@/types/dashboard';
import { ALL_CARD_CONFIGS, ALL_MICRO_APPS, DEFAULT_LAYOUT_CONFIG } from '@/config/app-registry';
import type { AppRegistration } from '@/config/app-registry';
import eventBus from '@/lib/event-bus';

const LAYOUT_STORAGE_KEY = 'dashboardLayout_v10_stable';

interface LayoutState {
  layoutItems: LayoutItem[];
  isLayoutInitialized: boolean;
  focusedItemId: string | null;
  activeAppContext: AppRegistration | null;
  initializeLayout: (items: LayoutItem[]) => void;
  setFocusedItemId: (id: string | null) => void;
  updateItemLayout: (id: string, newPos: Position, newSize?: Size) => void;
  bringToFront: (id: string) => void;
  closeItem: (id: string) => void;
  toggleMinimizeItem: (id: string) => void;
  toggleMaximizeItem: (id: string) => void;
  addCard: (cardId: string) => string | undefined;
  launchApp: (app: AppRegistration) => string;
  cloneApp: (appId: string) => string | undefined;
  closeAllInstancesOfApp: (appId: string) => boolean;
  focusLatestInstance: (appId: string) => boolean;
  moveItem: (itemId: string, newPos: Position) => void;
  reloadApp: (itemId: string) => void;
  resetLayout: () => void;
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set, get) => ({
      layoutItems: [],
      isLayoutInitialized: false,
      focusedItemId: null,
      activeAppContext: null,
      
      initializeLayout: (items) => set({ layoutItems: items, isLayoutInitialized: true }),
      
      setFocusedItemId: (id) => set({ focusedItemId: id }),

      updateItemLayout: (id, newPos, newSize) => set(state => ({
        layoutItems: state.layoutItems.map(layout =>
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
      })),

      bringToFront: (id) => set(state => {
        if (state.focusedItemId === id) return {};

        const maxZ = state.layoutItems.length > 0 ? Math.max(0, ...state.layoutItems.map(item => item.zIndex || 0)) : 0;
        
        const newItems = state.layoutItems.map(layout =>
          layout.id === id
            ? { ...layout, zIndex: maxZ + 1 }
            : layout
        );
        
        const itemToFront = newItems.find(item => item.id === id);
        let newActiveAppContext: AppRegistration | null = null;
        if (itemToFront?.type === 'app' && itemToFront.appId) {
            newActiveAppContext = ALL_MICRO_APPS.find(app => app.id === itemToFront.appId) || null;
        }

        return { layoutItems: newItems, focusedItemId: id, activeAppContext: newActiveAppContext };
      }),

      closeItem: (itemId) => {
        const itemToClose = get().layoutItems.find(item => item.id === itemId);
        
        set(state => {
            const isClosingFocused = state.focusedItemId === itemId;
            return {
                layoutItems: state.layoutItems.filter(item => item.id !== itemId),
                focusedItemId: isClosingFocused ? null : state.focusedItemId,
                activeAppContext: isClosingFocused ? null : state.activeAppContext,
            }
        });

        if (itemToClose) {
            let itemName = "Item";
            const config = itemToClose.type === 'card'
                ? ALL_CARD_CONFIGS.find(c => c.id === itemToClose.cardId)
                : ALL_MICRO_APPS.find(a => a.id === itemToClose.appId);
            if (config) itemName = config.title;

            eventBus.emit('orchestration:log', { 
                task: 'Item Closed', 
                status: 'success', 
                details: `"${itemName}" was removed from the workspace.`
            });
        }
      },

      toggleMinimizeItem: (id) => set(state => ({
        layoutItems: state.layoutItems.map(item => {
          if (item.id === id) {
            const isNowMinimized = !item.isMinimized;
            if (isNowMinimized) {
              return { ...item, isMinimized: true, isMaximized: false, lastHeight: item.height, height: 44 };
            } else {
              const config = item.type === 'card' 
                ? ALL_CARD_CONFIGS.find(c => c.id === item.cardId) 
                : ALL_MICRO_APPS.find(a => a.id === item.appId);
              const defaultHeight = (config && 'minHeight' in config ? config.minHeight : config?.defaultSize.height) ?? 200;
              return { ...item, isMinimized: false, height: item.lastHeight || defaultHeight, lastHeight: undefined };
            }
          }
          return item;
        }),
      })),
      
      toggleMaximizeItem: (id) => set(state => {
          const maxZ = state.layoutItems.length > 0 ? Math.max(0, ...state.layoutItems.map(item => item.zIndex || 0)) : 0;
          return {
              layoutItems: state.layoutItems.map(item => {
                  if (item.id === id) {
                      const isNowMaximized = !item.isMaximized;
                      if (isNowMaximized) {
                          return {
                              ...item, isMaximized: true, isMinimized: false,
                              lastX: item.x, lastY: item.y, lastWidth: item.width,
                              lastHeight: item.isMinimized ? item.lastHeight : item.height, zIndex: maxZ + 1,
                          };
                      } else {
                          return {
                              ...item, isMaximized: false,
                              x: item.lastX ?? 50, y: item.lastY ?? 50,
                              width: item.lastWidth ?? 500, height: item.lastHeight ?? 400,
                              lastX: undefined, lastY: undefined, lastWidth: undefined, lastHeight: undefined,
                          };
                      }
                  }
                  // When one item is maximized, ensure no others are
                  return { ...item, isMaximized: false };
              }),
              focusedItemId: id,
          };
      }),

      addCard: (cardId) => {
        const currentItems = get().layoutItems;
        const cardConfig = ALL_CARD_CONFIGS.find(c => c.id === cardId);
        if (!cardConfig) return undefined;
        
        if (currentItems.some(item => item.id === cardId)) {
            get().bringToFront(cardId);
            eventBus.emit('orchestration:log', { 
                task: 'Item Focused', 
                status: 'success', 
                details: `"${cardConfig.title}" is already open and has been focused.`,
                targetId: cardId
            });
            return cardId;
        }

        const maxZ = currentItems.length > 0 ? Math.max(0, ...currentItems.map(item => item.zIndex || 0)) : 0;
        const newCard: LayoutItem = { id: cardId, type: 'card', cardId: cardId, x: cardConfig.defaultSize.x, y: cardConfig.defaultSize.y, width: cardConfig.defaultSize.width, height: cardConfig.defaultSize.height, zIndex: maxZ + 1 };
        set(state => ({
          layoutItems: [...state.layoutItems, newCard],
          focusedItemId: cardId
        }));
        
        eventBus.emit('orchestration:log', { 
            task: 'Card Added', 
            status: 'success', 
            details: `"${cardConfig.title}" was added to the workspace.`,
            targetId: cardId
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
          id: instanceId, type: 'app', appId: app.id,
          x: 480 + staggerOffset, y: 310 + staggerOffset,
          width: app.defaultSize.width, height: app.defaultSize.height,
          zIndex: maxZ + 1
        };
        set(state => ({ 
            layoutItems: [...state.layoutItems, newAppWindow], 
            focusedItemId: instanceId,
            activeAppContext: app,
        }));
        
        eventBus.emit('orchestration:log', {
            task: 'App Launched', status: 'success',
            details: `A new instance of "${app.title}" has been launched.`, targetId: instanceId
        });
        return instanceId;
      },
      
      cloneApp: (appId) => {
        const currentItems = get().layoutItems;
        const openInstances = currentItems.filter(item => item.type === 'app' && item.appId === appId);
        if (openInstances.length === 0) return undefined;
        const sourceInstance = openInstances.reduce((latest, current) => (current.zIndex > latest.zIndex ? current : latest));
        const instanceId = `${appId}-${crypto.randomUUID()}`;
        const maxZ = Math.max(0, ...currentItems.map(item => item.zIndex || 0));
        const newAppWindow: LayoutItem = {
            id: instanceId, type: 'app', appId: sourceInstance.appId,
            x: sourceInstance.x + 30, y: sourceInstance.y + 30,
            width: sourceInstance.width, height: sourceInstance.height, zIndex: maxZ + 1,
        };
        set(state => ({ layoutItems: [...state.layoutItems, newAppWindow], focusedItemId: instanceId }));
        
        const appConfig = ALL_MICRO_APPS.find(a => a.id === appId);
        if (appConfig) {
            eventBus.emit('orchestration:log', {
                task: 'App Cloned', status: 'success', details: `Cloned instance of "${appConfig.title}".`, targetId: instanceId
            });
        }
        return instanceId;
      },

      closeAllInstancesOfApp: (appId) => {
        const currentItems = get().layoutItems;
        const itemsToKeep = currentItems.filter(item => !(item.type === 'app' && item.appId === appId));
        if (itemsToKeep.length === currentItems.length) return false;
        set(state => ({
            layoutItems: itemsToKeep,
            focusedItemId: state.focusedItemId && itemsToKeep.some(i => i.id === state.focusedItemId) ? state.focusedItemId : null,
        }));
        return true;
      },
      
      focusLatestInstance: (appId) => {
        const instances = get().layoutItems.filter(item => item.type === 'app' && item.appId === appId);
        if (instances.length > 0) {
            const latestInstance = instances.reduce((latest, current) => (current.zIndex > latest.zIndex ? current : latest));
            get().bringToFront(latestInstance.id);
            return true;
        }
        return false;
      },

      moveItem: (itemId, newPos) => {
        set(state => ({
          layoutItems: state.layoutItems.map(item =>
            item.id === itemId ? { ...item, x: newPos.x, y: newPos.y } : item
          )
        }));
        get().bringToFront(itemId);
      },
      
      reloadApp: (itemId: string) => set(state => {
        const itemIndex = state.layoutItems.findIndex(item => item.id === itemId);
        if (itemIndex === -1) return state;

        const itemToReload = state.layoutItems[itemIndex];
        const newId = `${itemToReload.cardId || itemToReload.appId}-${crypto.randomUUID()}`;
        const maxZ = Math.max(0, ...state.layoutItems.map(item => item.zIndex || 0));

        const newItem: LayoutItem = { ...itemToReload, id: newId, zIndex: maxZ + 1, isMinimized: false, isMaximized: false };

        const newLayoutItems = [...state.layoutItems];
        newLayoutItems[itemIndex] = newItem;
        return { layoutItems: newLayoutItems, focusedItemId: newId };
      }),

      resetLayout: () => {
        set({ layoutItems: DEFAULT_LAYOUT_CONFIG, focusedItemId: null, activeAppContext: null });
        eventBus.emit('orchestration:log', {
            task: 'Layout Reset', status: 'success', details: `Workspace layout has been reset to default.`
        });
      },
    }),
    {
      name: LAYOUT_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
