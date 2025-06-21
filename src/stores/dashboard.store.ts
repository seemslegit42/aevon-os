import { create } from 'zustand';

interface DashboardState {
  focusedCardId: string | null;
  setFocusedCardId: (id: string | null) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  focusedCardId: null,
  setFocusedCardId: (id) => set({ focusedCardId: id }),
}));
