
"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type HumorFrequency = 'low' | 'medium' | 'high';

interface AgentConfigState {
  isHumorEnabled: boolean;
  humorFrequency: HumorFrequency;
  setIsHumorEnabled: (isEnabled: boolean) => void;
  setHumorFrequency: (frequency: HumorFrequency) => void;
}

export const useAgentConfigStore = create<AgentConfigState>()(
  persist(
    (set) => ({
      isHumorEnabled: true,
      humorFrequency: 'medium',
      setIsHumorEnabled: (isEnabled) => set({ isHumorEnabled: isEnabled }),
      setHumorFrequency: (frequency) => set({ humorFrequency: frequency }),
    }),
    {
      name: 'aevon-agent-config-v1',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
