
import { create } from 'zustand';
import type { ComponentType, LazyExoticComponent } from 'react';

// Define the shape of a micro-app's metadata, now with permissions
export interface MicroApp {
  id: string;
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  component: LazyExoticComponent<ComponentType<any>>; // The actual React component for the app, lazy loaded
  isActive: boolean;
  permissions?: string[]; // Optional permissions required to use the app
}

export type MicroAppRegistration = Omit<MicroApp, 'isActive'>;

// Define the shape of the store's state and actions
interface MicroAppStoreState {
  apps: MicroApp[];
  _hasHydrated: boolean;
  initializeApps: (initialApps: MicroAppRegistration[]) => void;
  activateApp: (appId: string) => void;
  deactivateApp: (appId: string) => void;
  deactivateAllApps: () => void;
  getActiveApps: () => MicroApp[];
}

const ACTIVE_APPS_STORAGE_KEY = 'aevonActiveMicroAppIds_v1';

export const useMicroAppStore = create<MicroAppStoreState>((set, get) => ({
  apps: [],
  _hasHydrated: false, // Flag to prevent saving to storage before hydration is complete

  initializeApps: (initialApps) => {
    if (get()._hasHydrated) return; // Prevent re-initialization

    let activeIds: string[] = [];
    if (typeof window !== 'undefined') {
        try {
            const savedActiveIdsJSON = localStorage.getItem(ACTIVE_APPS_STORAGE_KEY);
            if (savedActiveIdsJSON) {
                const parsedIds = JSON.parse(savedActiveIdsJSON);
                if (Array.isArray(parsedIds)) {
                    activeIds = parsedIds;
                }
            }
        } catch (e) {
            console.error("Could not read active micro-apps from localStorage", e);
            localStorage.removeItem(ACTIVE_APPS_STORAGE_KEY);
        }
    }
    
    const allApps = initialApps.map(app => ({
        ...app,
        isActive: activeIds.includes(app.id)
    }));
    
    set({ apps: allApps, _hasHydrated: true });
  },

  activateApp: (appId) => {
    set((state) => ({
      apps: state.apps.map(app => 
        app.id === appId ? { ...app, isActive: true } : app
      ),
    }));
  },

  deactivateApp: (appId) => {
    set((state) => ({
      apps: state.apps.map(app =>
        app.id === appId ? { ...app, isActive: false } : app
      ),
    }));
  },

  deactivateAllApps: () => {
    set((state) => ({
      apps: state.apps.map(app => ({
        ...app,
        isActive: false,
      })),
    }));
  },

  getActiveApps: () => {
    return get().apps.filter(app => app.isActive);
  }
}));

// Subscribe to store changes to save active apps to localStorage
useMicroAppStore.subscribe((state) => {
    if (state._hasHydrated && typeof window !== 'undefined') {
        try {
            const activeIds = state.apps.filter(app => app.isActive).map(app => app.id);
            localStorage.setItem(ACTIVE_APPS_STORAGE_KEY, JSON.stringify(activeIds));
        } catch (e) {
            console.error("Could not save active micro-apps to localStorage", e);
        }
    }
});
