
import mitt, { type Emitter } from 'mitt';
import type { AiGeneratedFlowData } from './ai-schemas';
import type { AvatarState } from '@/types/dashboard';
import type { BeepEmotion, TimelineEvent } from '@/types/loom';

type AppEvents = {
  // BEEP Agent Communication
  'beep:submitQuery': string;
  'beep:response': string; 
  'beep:setEmotion': BeepEmotion;

  // Loom Workflow Events
  'loom:flow-generated': AiGeneratedFlowData;
  'loom:open-templates': void;
  'loom:workflow-started': void;
  'loom:workflow-completed': void;
  
  // Tool execution events
  'tool:success': { toolName: string };
  'tool:error': { toolName: string };

  // System-level Events
  'orchestration:log': { task: string; status: 'success' | 'failure'; details: string; targetId?: string; };
  'panel:focus': string;
  'timeline:event': Omit<TimelineEvent, 'id' | 'timestamp'>;

  [key: string]: unknown;
};

const eventBus: Emitter<AppEvents> = mitt<AppEvents>();

export default eventBus;

    