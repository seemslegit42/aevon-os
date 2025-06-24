
import mitt, { type Emitter } from 'mitt';
import type { AiInsights, ContentGeneration, WebSummarizerResult, AiGeneratedFlowData, InvoiceData } from './ai-schemas';
import type { AvatarState } from '@/types/dashboard';
import type { BeepEmotion, TimelineEvent } from '@/types/loom';

type AppEvents = {
  // BEEP Agent Communication
  'beep:submitQuery': string;
  'beep:response': string; 
  'beep:setEmotion': BeepEmotion;

  // AI Insights Events
  'insights:result': AiInsights;
  'insights:error': string;
  
  // Content Generation Events
  'content:result': ContentGeneration;
  'content:error': string;
  
  // Web Summarizer Events
  'websummarizer:result': WebSummarizerResult;
  'websummarizer:error': string;

  // Loom Workflow Events
  'loom:flow-generated': AiGeneratedFlowData;
  'loom:open-templates': void;
  'loom:node-result': { content: string };
  'loom:workflow-started': void;
  'loom:workflow-completed': void;
  
  // Tool execution events
  'tool:success': { toolName: string };
  'tool:error': { toolName: string };

  // Data update events
  'accounting:invoice-extracted': InvoiceData;

  // System-level Events
  'orchestration:log': { task: string; status: 'success' | 'failure'; details: string; targetId?: string; };
  'panel:focus': string;
  'timeline:event': Omit<TimelineEvent, 'id' | 'timestamp'>;

  [key: string]: unknown;
};

const eventBus: Emitter<AppEvents> = mitt<AppEvents>();

export default eventBus;
