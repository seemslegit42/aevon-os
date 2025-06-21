
import mitt, { type Emitter } from 'mitt';

// Define event types and their payloads
type AppEvents = {
  'panel:focus': string; // payload is the cardId
  'command:submit': string; // payload is the query from the top bar
  'beep:submitQuery': string; // payload is the query to be appended to BEEP
  'notification:new': undefined; // A new notification has occurred
  'orchestration:log': { task: string; status: 'success' | 'failure'; details: string; }; // A task has been performed
  [key: string]: unknown;
};

const eventBus: Emitter<AppEvents> = mitt<AppEvents>();

export default eventBus;
