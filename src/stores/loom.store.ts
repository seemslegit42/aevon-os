
'use client';

import { create } from 'zustand';
import type { WorkflowNodeData, Connection, NodeStatus } from '@/types/loom';
import { generateNodeId } from '@/lib/utils';

interface LoomState {
  nodes: WorkflowNodeData[];
  connections: Connection[];
  selectedNodeId: string | null;
  setWorkflow: (data: { nodes: WorkflowNodeData[], connections: Connection[] }) => void;
  setSelectedNodeId: (nodeId: string | null) => void;
  addNode: (nodeData: Omit<WorkflowNodeData, 'id' | 'status'> & { status?: NodeStatus }) => WorkflowNodeData;
  updateNode: (nodeId: string, updates: Partial<WorkflowNodeData>) => void;
  deleteNode: (nodeId: string) => void;
  addConnection: (fromNodeId: string, toNodeId: string) => void;
  clearWorkflow: () => void;
}

export const useLoomStore = create<LoomState>((set, get) => ({
  nodes: [],
  connections: [],
  selectedNodeId: null,
  
  setWorkflow: (data) => set({ nodes: data.nodes, connections: data.connections, selectedNodeId: null }),

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
    const newConnection: Connection = {
      id: `conn-${fromNodeId}-to-${toNodeId}-${Date.now()}`,
      from: fromNodeId,
      to: toNodeId,
    };
    set(state => ({ connections: [...state.connections, newConnection] }));
  },

  clearWorkflow: () => set({ nodes: [], connections: [], selectedNodeId: null }),
}));
