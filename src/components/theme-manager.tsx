"use client";

import React, { useEffect, useState } from 'react';
import { useThemeStore } from '@/stores/theme.store';

export default function ThemeManager({ children }: { children: React.ReactNode }) {
  const currentThemeFromStore = useThemeStore(state => state.theme);
  const hasHydratedInStore = useThemeStore(state => state._hasHydrated);
  const setHasHydratedInStore = useThemeStore(state => state.setHasHydrated);
  const setThemeInStore = useThemeStore(state => state.setTheme);
  
  // Local state to track if this component's initial client-side effects have run
  const [isClientLoaded, setIsClientLoaded] = useState(false);

  useEffect(() => {
    // This effect runs once when the component mounts on the client.
    if (!hasHydratedInStore) {
      // The store's onRehydrateStorage should have handled applying the theme from localStorage.
      // If not, or for robustness, we can re-check and apply here.
      let themeToApply = 'light'; // Default
      try {
        const storedData = localStorage.getItem('app-theme-storage');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          if (parsedData.state && (parsedData.state.theme === 'light' || parsedData.state.theme === 'dark')) {
            themeToApply = parsedData.state.theme;
          }
        }
      } catch (e) {
        console.error("Error reading theme from localStorage in ThemeManager:", e);
      }
      
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(themeToApply);

      // Sync store if its current theme (possibly default) doesn't match
      if (currentThemeFromStore !== themeToApply) {
        setThemeInStore(themeToApply);
      }
      setHasHydratedInStore(true);
    }
    setIsClientLoaded(true); // Mark that client-side setup is done
  }, [hasHydratedInStore, setHasHydratedInStore, setThemeInStore, currentThemeFromStore]);

  // Effect to react to changes in the store's theme *after* initial hydration
  useEffect(() => {
    if (hasHydratedInStore && typeof window !== 'undefined') {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(currentThemeFromStore);
    }
  }, [currentThemeFromStore, hasHydratedInStore]);

  // To prevent rendering children before client-side theme setup,
  // especially important if children depend on the theme.
  if (!isClientLoaded) {
    return null; // Or a loading indicator
  }

  return <>{children}</>;
}
