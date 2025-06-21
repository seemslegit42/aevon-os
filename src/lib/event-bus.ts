
import mitt, { type Emitter } from 'mitt';
import type { MicroApp } from '@/stores/micro-app.store';

// Define event types and their payloads
type AppEvents = {
  // Panel/Card Events
  'panel:focus': string; // payload is the cardId
  'panel:add': string; // payload is cardId
  'panel:remove': string; // payload is itemId (cardId or app instance id)
  'layout:reset': undefined;

  // App Events
  'app:launch': MicroApp; // payload is the app object to launch
  'app:clone': string; // payload is the appId of the app to clone

  // AI Command Events
  'command:submit': string; // payload is the query from the top bar
  'beep:submitQuery': string; // payload is the query to be appended to BEEP
  
  // Notification Events
  'notification:new': undefined; // A new notification has occurred
  'orchestration:log': { task: string; status: 'success' | 'failure'; details: string; }; // A task has been performed
  
  [key: string]: unknown;
};

const eventBus: Emitter<AppEvents> = mitt<AppEvents>();

export default eventBus;
