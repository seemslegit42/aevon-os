
import mitt, { type Emitter } from 'mitt';

// Define event types and their payloads
type AppEvents = {
  'panel:focus': string; // payload is the cardId
  'agents:statusUpdate': { activeCount: number; totalCount: number };
  'command:submit': string; // payload is the query from the top bar
  'beep:submitQuery': string; // payload is the query to be appended to BEEP
  [key: string]: unknown;
};

const eventBus: Emitter<AppEvents> = mitt<AppEvents>();

export default eventBus;
