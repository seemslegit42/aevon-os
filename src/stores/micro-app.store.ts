
import { create } from 'zustand';
import type { ComponentType, LazyExoticComponent } from 'react';
import type { z } from 'zod';
import type { UIControl, MicroAppRoute } from '@/types/dashboard';

// Define the shape of a micro-app's metadata, now with permissions and tags
export interface MicroAppRegistration {
  id: string;
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  permissions: string[]; // Permissions required to use the app
  tags: string[]; // Tags for filtering and discovery
  defaultSize: { width: number; height: number };
  persona?: {
    name: string;
    description: string;
  };
  
  // --- New properties based on prompt ---

  /** The base URL path for this app if it's a page-level component. e.g., "/aegis-security" */
  baseRoute?: string;
  
  /** Optional array of sub-routes for more complex apps. */
  routes?: MicroAppRoute[];

  /** Optional array of UI controls to be rendered in a shared toolbar or menu. */
  controls?: UIControl[];
  
  /** An optional Zod schema for validating the app's configuration or props. */
  configSchema?: z.ZodObject<any>;
}

// Define the shape of the store's state and actions
interface MicroAppStoreState {
  apps: MicroAppRegistration[];
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
      // Prevent duplicate registrations
      if (state.apps.some(app => app.id === appRegistration.id)) {
        console.warn(
          `[MicroAppRegistry] Attempted to register duplicate micro-app with ID: "${appRegistration.id}". Registration ignored.`
        );
        return state;
      }
      console.log(`[MicroAppRegistry] Registered new micro-app: "${appRegistration.title}" (ID: ${appRegistration.id})`);
      return { apps: [...state.apps, appRegistration] };
    });
  },
}));
