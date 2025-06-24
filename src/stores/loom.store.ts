
'use client';

import { create } from 'zustand';
import type { WorkflowNodeData, Connection } from '@/types/loom';

interface LoomState {
  nodes: WorkflowNodeData[];
  connections: Connection[];
  selectedNodeId: string | null;
  setWorkflow: (data: { nodes: WorkflowNodeData[], connections: Connection[] }) => void;
  setSelectedNodeId: (nodeId: string | null) => void;
}

export const useLoomStore = create<LoomState>((set) => ({
  nodes: [],
  connections: [],
  selectedNodeId: null,
  setWorkflow: (data) => set({ nodes: data.nodes, connections: data.connections }),
  setSelectedNodeId: (nodeId) => set({ selectedNodeId: nodeId }),
}));
