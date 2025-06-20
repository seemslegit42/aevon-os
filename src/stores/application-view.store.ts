
import { create } from 'zustand';

interface ApplicationViewState {
  currentAppId: string | null;
  // Add other relevant state for the application view, e.g., app-specific data
  setCurrentAppId: (appId: string | null) => void;
}

export const useApplicationViewStore = create<ApplicationViewState>((set) => ({
  currentAppId: null,
  setCurrentAppId: (appId) => set({ currentAppId: appId }),
  // Potentially, methods to load/unload app-specific data or content could go here
}));
