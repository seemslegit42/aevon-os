import mitt, { type Emitter } from 'mitt';

// Define event types and their payloads
// Example:
// type AppEvents = {
//   'zone:updated': { zoneId: string; data: any };
//   'command:execute': { command: string; args?: any[] };
// };

// For now, using a generic event map
type AppEvents = {
  [key: string]: unknown;
};

const eventBus: Emitter<AppEvents> = mitt<AppEvents>();

export default eventBus;
