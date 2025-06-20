// This store is no longer used as the application is dark mode only.
// Providing minimal exports to prevent build errors if accidentally imported.

export const useThemeStore = () => ({
  theme: 'dark',
  toggleTheme: () => {},
  setTheme: () => {},
  _hasHydrated: true,
  setHasHydrated: () => {},
});
