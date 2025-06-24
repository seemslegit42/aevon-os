
"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AVATAR_PRESETS, type AvatarPreset } from '@/config/avatar-presets.config';

interface AvatarPresetState {
  presets: AvatarPreset[];
  activePresetId: AvatarPreset['id'];
  setActivePresetId: (id: AvatarPreset['id']) => void;
  getActivePreset: () => AvatarPreset;
}

export const useAvatarPresetStore = create<AvatarPresetState>()(
  persist(
    (set, get) => ({
      presets: AVATAR_PRESETS,
      activePresetId: 'sentientCore', // Default preset
      setActivePresetId: (id) => set({ activePresetId: id }),
      getActivePreset: () => {
        const { presets, activePresetId } = get();
        return presets.find(p => p.id === activePresetId) || presets[0];
      },
    }),
    {
      name: 'aevon-avatar-preset-v1', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
