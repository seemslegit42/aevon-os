'use client';
import { create } from 'zustand';

interface AegisState {
  cyberHealthScore: number;
  actions: {
    simulateUpdate: () => void;
  };
}

export const useAegisStore = create<AegisState>((set) => ({
  cyberHealthScore: 88, // Initial score
  actions: {
    simulateUpdate: () => set((state) => {
      // Simulate a small fluctuation in the score
      const scoreChange = (Math.random() - 0.45) * 5;
      const newScore = Math.max(0, Math.min(100, Math.round(state.cyberHealthScore + scoreChange)));
      return { cyberHealthScore: newScore };
    }),
  },
}));
