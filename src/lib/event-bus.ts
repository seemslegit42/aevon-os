
import mitt, { type Emitter } from 'mitt';

// Define event types and their payloads
type AppEvents = {
  'panel:focus': string; // payload is the cardId
  'agents:statusUpdate': { activeCount: number; totalCount: number };
  [key: string]: unknown;
};

const eventBus: Emitter<AppEvents> = mitt<AppEvents>();

export default eventBus;
