
import { useEffect } from 'react';
import { useLayoutStore } from '@/stores/layout.store';

/**
 * This hook acts as a central controller for the dashboard layout.
 * Its sole responsibility is to initialize the dashboard state from localStorage
 * or from the default configuration when the application first loads.
 * All other state manipulations are now handled directly through actions
 * in the Zustand store, promoting a more predictable and traceable data flow.
 */
export function useDashboardLayout() {
  const { initialize } = useLayoutStore.getState();

  // This effect runs once on mount to initialize the dashboard.
  useEffect(() => {
    initialize();
  }, [initialize]);

  // This hook doesn't need to return anything as it's a controller.
  // UI components will select their state and actions directly from the store.
}
