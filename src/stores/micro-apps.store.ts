
import { create } from 'zustand';
import type { LucideIcon } from 'lucide-react';

interface MicroAppItem {
  id: string;
  icon: LucideIcon;
  label: string;
}

interface MicroAppsState {
  availableApps: MicroAppItem[];
  initializeApps: (apps: MicroAppItem[]) => void;
  // Potentially actions to add/remove apps dynamically if the list isn't static
}

export const useMicroAppsStore = create<MicroAppsState>((set) => ({
  availableApps: [],
  initializeApps: (apps) => set({ availableApps: apps }),
}));
