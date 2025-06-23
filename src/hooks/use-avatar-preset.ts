
'use client';
import { useAvatarPresetStore } from '@/stores/avatar-preset.store';

/**
 * A simple hook to get the currently active avatar preset object.
 */
export const useAvatarPreset = () => {
  return useAvatarPresetStore(state => state.getActivePreset());
};
