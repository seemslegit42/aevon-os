
"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type HumorFrequency = 'low' | 'medium' | 'high';

interface AgentConfigState {
  isHumorEnabled: boolean;
  humorFrequency: HumorFrequency;
  isWhisperModeEnabled: boolean;
  setIsHumorEnabled: (isEnabled: boolean) => void;
  setHumorFrequency: (frequency: HumorFrequency) => void;
  toggleWhisperMode: () => void;
}

export const useAgentConfigStore = create<AgentConfigState>()(
  persist(
    (set) => ({
      isHumorEnabled: true,
      humorFrequency: 'medium',
      isWhisperModeEnabled: false,
      setIsHumorEnabled: (isEnabled) => set({ isHumorEnabled: isEnabled }),
      setHumorFrequency: (frequency) => set({ humorFrequency: frequency }),
      toggleWhisperMode: () => set((state) => ({ isWhisperModeEnabled: !state.isWhisperModeEnabled })),
    }),
    {
      name: 'aevon-agent-config-v1',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
