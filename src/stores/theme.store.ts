import { create } from 'zustand';
import { persist, type PersistOptions } from 'zustand/middleware';

interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  _hasHydrated: boolean; // Flag to check if rehydration is complete
  setHasHydrated: (hydrated: boolean) => void;
}

// Correct type for onRehydrateStorage in PersistOptions
type OnRehydrateStorageCallback = (state: ThemeState | undefined, error?: Error | undefined) => void | Promise<void>;


const persistOptions: PersistOptions<ThemeState> = {
  name: 'app-theme-storage', // Name of the item in localStorage
  onRehydrateStorage: () => (state, error) => {
    if (error) {
      console.error("An error occurred during theme store rehydration:", error);
      // Potentially set a default theme on error or leave as is
      if (typeof window !== 'undefined') {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light'); // Fallback to light
      }
    } else if (state) {
      // Apply the hydrated theme to the documentElement
      if (typeof window !== 'undefined') {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(state.theme);
      }
      // Mark hydration as complete using the store's setter
      // This needs to be called on the actual store instance, so it's better done in ThemeManager
    }
  },
  partialize: (state) => ({
    theme: state.theme,
    // _hasHydrated is intentionally not persisted
  }),
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light', // Default theme
      _hasHydrated: false,
      setHasHydrated: (hydrated) => set({ _hasHydrated: hydrated }),
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
        if (typeof window !== 'undefined') {
          document.documentElement.classList.remove('light', 'dark');
          document.documentElement.classList.add(newTheme);
        }
      },
      setTheme: (themeValue) => {
        set({ theme: themeValue });
        if (typeof window !== 'undefined') {
          document.documentElement.classList.remove('light', 'dark');
          document.documentElement.classList.add(themeValue);
        }
      },
    }),
    persistOptions
  )
);
