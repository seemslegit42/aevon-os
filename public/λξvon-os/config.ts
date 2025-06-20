// config.ts
import React from 'react';
// Import icon components directly, IconProps will be defined in this file.
import {
    ChartBarIcon, CpuIcon, AlertCircleIcon,
    BrainCircuitIcon, SendIcon, PresentationIcon, FileTextIcon,
    MessageSquareIcon, ZapIcon, GitForkIcon, Settings2Icon, BinaryIcon,
    GlobeIcon, DatabaseZapIcon, Share2Icon, TargetIcon
} from './src/components/icons';

// Define IconProps directly here
export interface IconProps {
  className?: string;
  size?: number | string;
  style?: React.CSSProperties;
  color?: string;
}

// Color Palette (defined in tailwind.config via CDN script, listed here for reference)
export const COLORS = {
  imperialPurple: '#6A0DAD',
  patinaGreen: '#3EB991',
  romanAqua: '#20B2AA',
  vitreousWhite: '#F5FFFA',
  conchoidalGray: '#8C94A8',
  obsidianBlack: '#1C1934',
  gildedAccent: '#FFD700',
};

// Font Families (defined in tailwind.config via CDN script, listed here for reference)
export const FONTS = {
  heading: 'Comfortaa, sans-serif',
  body: 'Lexend, sans-serif',
};

// --- Core Types ---

export enum ModelNames { // These are specific to Gemini, used by GeminiAIService
    TEXT_MODEL = 'gemini-2.5-flash-preview-04-17',
    IMAGE_MODEL = 'imagen-3.0-generate-002',
}

// MicroApp Configuration
export interface MicroApp {
  id: string; // Unique identifier, e.g., 'dataVisualizer'
  name: string; // Display name, e.g., 'Data Visualizer'
  icon: React.ComponentType<IconProps>; // Icon component for the app
  description?: string; // Optional description for command palette
  component: React.ComponentType<any>; // Component to render for this micro-app
}

// Import placeholder micro-app components
import { DataVisualizerApp } from './src/microapps/DataVisualizerApp';
import { PerformanceMonitorApp } from './src/microapps/PerformanceMonitorApp';
import { SecurityMonitorApp } from './src/microapps/SecurityMonitorApp';


export const INITIAL_MICRO_APPS: MicroApp[] = [
  {
    id: 'dataVisualizer',
    name: 'Data Visualizer',
    icon: ChartBarIcon,
    description: 'Visualize data with various chart types.',
    component: DataVisualizerApp
  },
  {
    id: 'performanceMonitor',
    name: 'Performance Monitor',
    icon: CpuIcon,
    description: 'Monitor system performance metrics.',
    component: PerformanceMonitorApp
  },
  {
    id: 'securityMonitor',
    name: 'Security Monitor',
    icon: AlertCircleIcon,
    description: 'Track security events and alerts.',
    component: SecurityMonitorApp
  },
];

// --- Loom Studio Types ---
export interface Port {
  id: string;
  name: string;
  type?: string; // e.g., 'string', 'number', 'boolean', 'data', 'trigger'
}

export interface StudioNode {
  id: string;
  type: string; // Corresponds to PaletteItem type
  label: string;
  icon: React.ComponentType<IconProps>;
  x: number;
  y: number;
  width: number;
  height: number;
  config: Record<string, any>;
  inputs: Port[];
  outputs: Port[];
}

export interface Edge {
  id: string;
  sourceNodeId: string;
  sourceOutputId: string;
  targetNodeId: string;
  targetInputId: string;
}

export interface PaletteItem {
  type: string;
  label: string;
  icon: React.ComponentType<IconProps>;
  category: string;
  defaultConfig: Record<string, any>;
  inputs: Port[]; // Define default inputs
  outputs: Port[]; // Define default outputs
  defaultWidth?: number;
  defaultHeight?: number;
}

export const NODE_DEFAULT_WIDTH = 220; // Slightly wider for more text
export const NODE_DEFAULT_HEIGHT = 120; // Adjusted default height

export const ALL_PALETTE_ITEMS: PaletteItem[] = [
  {
    type: 'PromptInput',
    label: 'Prompt Input',
    icon: MessageSquareIcon,
    category: 'Core Blocks',
    defaultConfig: { promptText: 'Enter your query:', outputVariable: 'userInput' },
    inputs: [{id: 'trigger', name: 'Trigger (Optional)'}],
    outputs: [{id: 'user_response', name: 'User Response'}]
  },
  {
    type: 'AgentCall',
    label: 'Agent Call',
    icon: ZapIcon,
    category: 'Core Blocks',
    defaultConfig: { agentId: 'default_agent_id', inputDataVariable: 'agent_input' },
    inputs: [{id: 'trigger', name: 'Trigger'}, {id: 'input_data', name: 'Input Data'}],
    outputs: [{id: 'agent_result', name: 'Agent Result'}]
  },
  {
    type: 'DecisionNode',
    label: 'Decision (If/Else)',
    icon: GitForkIcon,
    category: 'Logic & Control',
    defaultConfig: { conditionVariable: 'input_value', comparisonValue: 'true', operator: '===' },
    inputs: [{id: 'input_value', name: 'Input Value'}],
    outputs: [{id: 'true_path', name: 'True'}, {id: 'false_path', name: 'False'}]
  },
  {
    type: 'EventTrigger',
    label: 'Event Trigger',
    icon: Settings2Icon, 
    category: 'Logic & Control',
    defaultConfig: { eventType: 'schedule', scheduleCron: '0 * * * *' },
    inputs: [],
    outputs: [{id: 'event_data', name: 'Event Data'}]
  },
  {
    type: 'CustomCode',
    label: 'Custom Code',
    icon: BinaryIcon,
    category: 'Logic & Control',
    defaultConfig: { language: 'javascript', code: '// Your code here\n// Access input via `input.data`\n// Return output via `return { result: your_value };`', inputVariable: 'code_input' },
    inputs: [{id: 'data', name: 'Input Data'}],
    outputs: [{id: 'result', name: 'Result'}]
  },
  {
    type: 'WebSummarizer',
    label: 'Web Summarizer',
    icon: GlobeIcon,
    category: 'AI Modules',
    defaultConfig: { urlVariable: 'web_url', summaryLength: 'medium', model: "default-text-model" }, // Added model config
    inputs: [{id: 'url', name: 'URL'}],
    outputs: [{id: 'summary', name: 'Summary Text'}]
  },
  {
    type: 'TextGeneration',
    label: 'Text Generation',
    icon: BrainCircuitIcon,
    category: 'AI Modules',
    defaultConfig: { model: "default-text-model", temperature: 0.7, promptVariable: 'text_gen_prompt' }, // Changed model to generic
    inputs: [{id: 'prompt', name: 'Prompt'}],
    outputs: [{id: 'generated_text', name: 'Generated Text'}]
  },
  {
    type: 'DataTransform',
    label: 'Data Transformation',
    icon: DatabaseZapIcon,
    category: 'Data & Connectors',
    defaultConfig: { transformLogicJS: 'return inputData.map(item => ({...item, transformed: true}));', inputDataVariable: 'raw_data'},
    inputs: [{id: 'inputData', name: 'Input Data'}],
    outputs: [{id: 'transformedData', name: 'Transformed Data'}]
  },
  {
    type: 'APICall',
    label: 'API Call',
    icon: Share2Icon,
    category: 'Data & Connectors',
    defaultConfig: { method: 'GET', apiUrlVariable: 'api_url', headers: {}, bodyVariable: 'api_body' },
    inputs: [{id: 'trigger', name: 'Trigger'}, {id: 'url', name: 'API URL'}, {id: 'body', name: 'Request Body (Optional)'}],
    outputs: [{id: 'response', name: 'API Response'}, {id: 'error', name: 'Error (Optional)'}]
  },
  {
    type: 'OutputDisplay', 
    label: 'Output Display',
    icon: PresentationIcon, 
    category: 'Core Blocks',
    defaultConfig: { displayValue: '' },
    inputs: [{ id: 'data_to_display', name: 'Data' }],
    outputs: []
  },
];

// AI Model Response Type for Workflow Generation
export interface AIWorkflowNode {
  id: string; // Temporary ID like "ai_node_1"
  type: string; // Must match a type in ALL_PALETTE_ITEMS
  label: string;
  config?: Record<string, any>; // AI might suggest some config
}

export interface AIWorkflowEdge {
  id: string; // Temporary ID like "ai_edge_1"
  sourceNodeId: string; // Refers to AIWorkflowNode temporary ID
  sourceOutputId: string; // Port ID from ALL_PALETTE_ITEMS
  targetNodeId: string; // Refers to AIWorkflowNode temporary ID
  targetInputId: string; // Port ID from ALL_PALETTE_ITEMS
}

export interface AIWorkflowResponse {
  nodes: AIWorkflowNode[];
  edges: AIWorkflowEdge[];
  error?: string; // Optional error message from AI if generation had issues
}

// PageView type definition moved here
export type PageView =
  | 'dashboard' | 'pricing' | 'about' | 'contact' | 'blog' | 'loomStudio'
  // User
  | 'userSettings' | 'userProfile' | 'userOnboarding'
  // Auth
  | 'authLogin' | 'authRegister' | 'authForgotPassword' | 'authVerifyEmail'
  // Billing
  | 'billingOverview' | 'billingSubscriptions' | 'billingInvoices'
  // Team
  | 'teamManagement' | 'teamInvite' | 'teamRoles' | 'teamPermissions'
  // Workspace
  | 'workspaceSettings' | 'workspaceSwitch' | 'workspaceCreate' | 'workspaceSelect'
  // App
  | 'appNotifications' | 'appIntegrations' | 'appSupport'
  // Legal & Static
  | 'legalTerms' | 'legalPrivacy' | 'legalInfo' | 'staticStatus'
  // System
  | 'systemNotFound' | 'systemMaintenance' | 'systemLoading' | 'systemError';
