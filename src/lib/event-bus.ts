
import mitt, { type Emitter } from 'mitt';
import type { AegisSecurityAnalysis, AiInsights, ContentGeneration, WebSummarizerResult, AiGeneratedFlowData, InvoiceData } from './ai-schemas';
import type { AvatarState } from '@/types/dashboard';
import type { BeepEmotion } from '@/types/loom';
import type { MonthlySales, SalesTrend } from '@/services/sales-data.service';

type AppEvents = {
  // BEEP Agent Communication
  'beep:submitQuery': string;
  'beep:response': string; 
  'beep:setEmotion': BeepEmotion;

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
  
  // Web Summarizer Events
  'websummarizer:result': WebSummarizerResult;
  'websummarizer:error': string;

  // Loom Workflow Events
  'loom:flow-generated': AiGeneratedFlowData;
  'loom:open-templates': void;
  'loom:node-result': { content: string };
  
  // Tool execution events
  'tool:success': { toolName: string };
  'tool:error': { toolName: string };

  // Data update events
  'sales-analytics:update': { monthlySales: MonthlySales[], salesTrend: SalesTrend[] };
  'accounting:invoice-extracted': InvoiceData;

  // System-level Events
  'orchestration:log': { task: string; status: 'success' | 'failure'; details: string; targetId?: string; };
  'panel:focus': string;

  [key: string]: unknown;
};

const eventBus: Emitter<AppEvents> = mitt<AppEvents>();

export default eventBus;
