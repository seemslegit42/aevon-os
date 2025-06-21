
import { create } from 'zustand';
import type { ComponentType, LazyExoticComponent } from 'react';

// Define the shape of a micro-app's metadata, now with permissions and tags
export interface MicroApp {
  id: string;
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  component: LazyExoticComponent<ComponentType<any>>; // The actual React component for the app, lazy loaded
  permissions: string[]; // Permissions required to use the app
  tags: string[]; // Tags for filtering and discovery
  defaultSize: { width: number; height: number };
}

export type MicroAppRegistration = MicroApp;

// Define the shape of the store's state and actions
interface MicroAppStoreState {
  apps: MicroApp[];
  initializeApps: (initialApps: MicroAppRegistration[]) => void;
  registerApp: (appRegistration: MicroAppRegistration) => void;
}

/**
 * This store now acts as a static registry for all available micro-apps in the OS.
 * The concept of "active" apps is now managed by the dashboard's layout store,
 * which tracks which app windows are currently open on the canvas.
 */
export const useMicroAppStore = create<MicroAppStoreState>((set) => ({
  apps: [],

  initializeApps: (initialApps) => {
    set({ apps: initialApps });
  },

  registerApp: (appRegistration) => {
    set((state) => {
      // Avoid duplicates
      if (state.apps.some(app => app.id === appRegistration.id)) {
        return state;
      }
      return { apps: [...state.apps, appRegistration] };
    });
  },
}));
