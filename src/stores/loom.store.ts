
'use client';

import { create } from 'zustand';
import type { WorkflowNodeData, Connection, NodeStatus, ConsoleMessage, TimelineEvent, ActionRequest } from '@/types/loom';
import { generateNodeId } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface LoomState {
  nodes: WorkflowNodeData[];
  connections: Connection[];
  selectedNodeId: string | null;
  consoleMessages: ConsoleMessage[];
  timelineEvents: TimelineEvent[];
  actionRequests: ActionRequest[];

  setWorkflow: (data: { nodes: WorkflowNodeData[], connections: Connection[] }) => void;
  setSelectedNodeId: (nodeId: string | null) => void;
  addNode: (nodeData: Omit<WorkflowNodeData, 'id' | 'status'> & { status?: NodeStatus }) => WorkflowNodeData;
  updateNode: (nodeId: string, updates: Partial<WorkflowNodeData>) => void;
  deleteNode: (nodeId: string) => void;
  addConnection: (fromNodeId: string, toNodeId: string) => void;
  clearWorkflow: () => void;
  
  // New actions for centralized state
  addConsoleMessage: (type: ConsoleMessage['type'], text: string) => void;
  clearConsole: () => void;
  addTimelineEvent: (event: Omit<TimelineEvent, 'id' | 'timestamp'>) => void;
  addActionRequest: (request: Omit<ActionRequest, 'id' | 'timestamp' | 'status'>) => void;
  updateActionRequestStatus: (requestId: string, status: ActionRequest['status'], details?: string) => void;
}

export const useLoomStore = create<LoomState>((set, get) => ({
  nodes: [],
  connections: [],
  selectedNodeId: null,
  consoleMessages: [],
  timelineEvents: [],
  actionRequests: [],
  
  setWorkflow: (data) => set({ 
    nodes: data.nodes, 
    connections: data.connections, 
    selectedNodeId: null,
    // Reset logs when a new workflow is set
    consoleMessages: [],
    timelineEvents: [],
    actionRequests: [],
  }),

  setSelectedNodeId: (nodeId) => set({ selectedNodeId: nodeId }),

  addNode: (nodeData) => {
    const uniqueIndex = Date.now();
    const nodeTitleBase = nodeData.title || 'Manual Node';
    const nodeId = generateNodeId('manual', nodeTitleBase, uniqueIndex);

    const newNode: WorkflowNodeData = {
      ...nodeData,
      id: nodeId,
      title: nodeTitleBase,
      description: nodeData.description || `Manually added ${nodeTitleBase} node. Configure in Inspector.`,
      status: 'queued',
      config: nodeData.config || {},
    };
    
    set(state => ({ nodes: [...state.nodes, newNode] }));
    return newNode;
  },

  updateNode: (nodeId, updates) => {
    set(state => ({
      nodes: state.nodes.map(node =>
        node.id === nodeId ? { ...node, ...updates } : node
      )
    }));
  },
  
  deleteNode: (nodeId) => {
    set(state => ({
      nodes: state.nodes.filter(n => n.id !== nodeId),
      connections: state.connections.filter(c => c.from !== nodeId && c.to !== nodeId),
      selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId,
    }));
  },

  addConnection: (fromNodeId, toNodeId) => {
    const { toast } = useToast.getState();
    const state = get();
    if (state.connections.some(c => c.from === fromNodeId && c.to === toNodeId)) {
        state.addConsoleMessage('warn', `Connection from ${fromNodeId} to ${toNodeId} already exists.`);
        return;
    }
    
    const newConnection: Connection = {
      id: `conn-${fromNodeId}-to-${toNodeId}-${Date.now()}`,
      from: fromNodeId,
      to: toNodeId,
    };
    set({ connections: [...state.connections, newConnection] });
    toast({ title: "Connection Created" });
  },

  clearWorkflow: () => set({ 
      nodes: [], 
      connections: [], 
      selectedNodeId: null, 
      consoleMessages: [], 
      timelineEvents: [],
      actionRequests: [] 
    }),

  // New state management functions
  addConsoleMessage: (type, text) => {
    const newMessage: ConsoleMessage = { type, text, timestamp: new Date() };
    set(state => ({ consoleMessages: [newMessage, ...state.consoleMessages.slice(0, 199)] }));
  },

  clearConsole: () => {
    set(state => ({ consoleMessages: [{ type: 'info', text: 'Local console view cleared.', timestamp: new Date() }] }));
  },

  addTimelineEvent: (event) => {
    const newEvent: TimelineEvent = { ...event, id: crypto.randomUUID(), timestamp: new Date() };
    set(state => ({ timelineEvents: [newEvent, ...state.timelineEvents.slice(0, 49)] }));
  },
  
  addActionRequest: (request) => {
      const newRequest: ActionRequest = {
        ...request,
        id: crypto.randomUUID(),
        timestamp: new Date(),
        status: 'pending',
      };
      set(state => ({ actionRequests: [...state.actionRequests, newRequest] }));
  },
  
  updateActionRequestStatus: (requestId, status, details) => {
      set(state => ({
        actionRequests: state.actionRequests.filter(req => req.id !== requestId),
      }));
  },
}));
