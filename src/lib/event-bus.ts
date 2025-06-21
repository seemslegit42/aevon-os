
import mitt, { type Emitter } from 'mitt';

type AppEvents = {
  'beep:submitQuery': string;
  'aegis:new-alert': string;
  'orchestration:log': { task: string; status: 'success' | 'failure'; details: string; targetId?: string; };
  'panel:focus': string;
  [key: string]: unknown;
};

const eventBus: Emitter<AppEvents> = mitt<AppEvents>();

export default eventBus;
