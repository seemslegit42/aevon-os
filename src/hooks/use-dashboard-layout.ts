
/**
 * @deprecated This hook is no longer in use as of the v2.0 refactor.
 * The dashboard initialization logic has been moved directly into the main <Dashboard /> component
 * to simplify the component hierarchy and data flow. This file is kept for historical purposes
 * but should not be used in new development.
 */
import { useEffect } from 'react';
import { useLayoutStore } from '@/stores/layout.store';

export function useDashboardLayout() {
  const { initialize } = useLayoutStore.getState();

  useEffect(() => {
    initialize();
  }, [initialize]);
}
