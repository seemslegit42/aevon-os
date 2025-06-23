import mitt, { type Emitter } from 'mitt';
import type { AegisSecurityAnalysis, AiInsights, ContentGeneration } from './ai-schemas';

type AppEvents = {
  // BEEP Agent Communication
  'beep:submitQuery': string;
  'beep:response': string; 

  // Aegis Security Events
  'aegis:new-alert': string;
  'aegis:analysis-result': AegisSecurityAnalysis;
  'aegis:analysis-error': string;

  // AI Insights Events
  'insights:result': AiInsights;
  'insights:error': string;
  
  // Content Generation Events
  'content:result': ContentGeneration;
  'content:error': string;
  
  // Loom Workflow Events (for visualization)
  'loom:categorizeText:success': any;
  'loom:categorizeText:error': string;
  'loom:extractInvoiceData:success': any;
  'loom:extractInvoiceData:error': string;
  'loom:logAndAlertAegis:success': any;
  'loom:logAndAlertAegis:error': string;

  // System-level Events
  'orchestration:log': { task: string; status: 'success' | 'failure'; details: string; targetId?: string; };
  'panel:focus': string;

  [key: string]: unknown;
};

const eventBus: Emitter<AppEvents> = mitt<AppEvents>();

export default eventBus;
