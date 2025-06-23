import type { WorkflowNodeData, NodeType } from "@/app/loom/workflow/workflow-node";

export interface PanelVisibility {
  palette: boolean;
  inspector: boolean;
  timeline: boolean;
  console: boolean;
  agentHub: boolean;
  actionConsole: boolean;
}

export interface ConnectingState {
  fromNodeId: string;
  fromPortElement: HTMLDivElement | null;
}

export interface AiGeneratedFlowData {
  message: string | null;
  workflowName?: string;
  nodes: WorkflowNodeData[];
  error?: boolean;
  userInput?: string;
  swarmId?: string;
}

export interface BackendSummarizeOutput {
  summary?: string;
  originalUrl: string;
  error?: string;
  logs?: string[];
}
export interface BackendExecutePromptOutput {
  responseText?: string;
  error?: string;
}

export interface ActionRequest {
  id: string;
  agentId: string;
  agentName: string;
  requestType: 'permission' | 'input' | 'clarification';
  message: string;
  timestamp: Date;
  status: 'pending' | 'approved' | 'denied' | 'responded';
  inputPrompt?: string;
  requiresInput?: boolean;
}

export interface ConsoleMessage {
  type: 'info' | 'log' | 'warn' | 'error';
  text: string;
  timestamp: Date;
}

export interface TimelineEvent {
  id: string;
  nodeId?: string;
  nodeTitle?: string;
  type: 'workflow_start' | 'node_queued' | 'node_running' | 'node_completed' | 'node_failed' | 'info' | 'workflow_completed' | 'workflow_failed';
  message: string;
  timestamp: Date;
}

export interface WorkflowTemplateNode {
  localId: string;
  title: string;
  type: NodeType;
  description: string;
  position?: { x: number; y: number };
  config?: Record<string, any>;
}

export interface WorkflowTemplateConnection {
  fromLocalId: string;
  toLocalId: string;
}

export interface WorkflowTemplate {
  name: string;
  description: string;
  nodes: WorkflowTemplateNode[];
  connections: WorkflowTemplateConnection[];
}

export interface Connection {
    id: string;
    from: string; // fromNodeId
    to: string;   // toNodeId
}
