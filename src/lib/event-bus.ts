
import mitt, { type Emitter } from 'mitt';

// Define event types and their payloads. This event bus is now used for
// inter-component communication that doesn't directly involve core layout state.
type AppEvents = {
  // AI Command Events - used to decouple the command source from the BEEP receiver
  'beep:submitQuery': string; // payload is the query to be appended to BEEP
  
  // Inter-component communication events for AI-driven workflows
  'aegis:new-alert': string; // payload is the alert data string for Aegis to analyze
  
  // Notification Events - Fired whenever an agentic action completes
  'orchestration:log': { task: string; status: 'success' | 'failure'; details: string; targetId?: string; };
  
  [key: string]: unknown;
};

const eventBus: Emitter<AppEvents> = mitt<AppEvents>();

export default eventBus;
