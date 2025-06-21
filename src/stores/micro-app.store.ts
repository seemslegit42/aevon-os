
import { create } from 'zustand';
import type { ComponentType, LazyExoticComponent } from 'react';

// Define the shape of a micro-app's metadata
export interface MicroApp {
  id: string;
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  component: LazyExoticComponent<ComponentType<any>>; // The actual React component for the app, lazy loaded
  isActive: boolean;
}

export type MicroAppRegistration = Omit<MicroApp, 'isActive'>;

// Define the shape of the store's state and actions
interface MicroAppStoreState {
  apps: MicroApp[];
  registerApps: (newApps: MicroAppRegistration[]) => void;
  activateApp: (appId: string) => void;
  deactivateAllApps: () => void;
  getActiveApp: () => MicroApp | undefined;
}

export const useMicroAppStore = create<MicroAppStoreState>((set, get) => ({
  apps: [],

  /**
   * Registers a list of micro-apps, adding them to the store.
   * Ensures no duplicate apps are added based on their ID.
   * @param newApps - An array of app objects to register.
   */
  registerApps: (newApps) => {
    set((state) => {
      const existingAppIds = new Set(state.apps.map(app => app.id));
      const filteredNewApps = newApps
        .filter(app => !existingAppIds.has(app.id))
        .map(app => ({ ...app, isActive: false }));
      
      return { apps: [...state.apps, ...filteredNewApps] };
    });
  },

  /**
   * Activates a single micro-app by its ID, deactivating all others.
   * @param appId - The ID of the app to activate.
   */
  activateApp: (appId) => {
    set((state) => ({
      apps: state.apps.map(app => ({
        ...app,
        isActive: app.id === appId,
      })),
    }));
  },

  /**
   * Deactivates all currently active micro-apps.
   */
  deactivateAllApps: () => {
    set((state) => ({
      apps: state.apps.map(app => ({
        ...app,
        isActive: false,
      })),
    }));
  },

  /**
   * A convenience getter to find the currently active app.
   * @returns The active app object or undefined if none are active.
   */
  getActiveApp: () => {
    return get().apps.find(app => app.isActive);
  }
}));
