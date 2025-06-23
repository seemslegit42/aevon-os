
'use client';
import { useTelemetryStore } from '@/stores/telemetry.store';
import { shallow } from 'zustand/shallow';

/**
 * A hook to interact with the avatar telemetry system.
 * Provides methods to log events and retrieve session history.
 */
export const useAvatarTelemetry = () => {
  const { logEvent, getSessionHistory, clearSessionHistory } = useTelemetryStore(
    (state) => ({
      logEvent: state.logEvent,
      getSessionHistory: state.getSessionHistory,
      clearSessionHistory: state.clearSessionHistory,
    }),
    shallow
  );

  return {
    logEvent,
    getSessionHistory,
    clearSessionHistory,
  };
};
