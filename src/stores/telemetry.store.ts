
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AvatarEvent } from '@/types/telemetry';

const TELEMETRY_STORAGE_KEY = 'aevon_avatar_telemetry_v1';
const MAX_EVENTS = 200;

interface TelemetryState {
  events: AvatarEvent[];
  logEvent: (eventType: AvatarEvent['eventType'], data: Omit<AvatarEvent, 'id' | 'timestamp' | 'eventType'>) => void;
  getSessionHistory: () => AvatarEvent[];
  clearSessionHistory: () => void;
}

export const useTelemetryStore = create<TelemetryState>()(
  persist(
    (set, get) => ({
      events: [],
      
      logEvent: (eventType, data) => {
        const newEvent: AvatarEvent = {
          ...data,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          eventType,
        };
        
        set(state => ({
          events: [newEvent, ...state.events].slice(0, MAX_EVENTS)
        }));
      },
      
      getSessionHistory: () => {
        return get().events;
      },
      
      clearSessionHistory: () => {
        set({ events: [] });
      }
    }),
    {
      name: TELEMETRY_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage), 
    }
  )
);
