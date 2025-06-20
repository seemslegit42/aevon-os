
import { create } from 'zustand';
import type { Agent } from '@/components/dashboard/agent-presence-card-content'; // Assuming Agent type is exported

interface AgentPresenceState {
  agents: Agent[];
  setAgents: (agents: Agent[]) => void;
  initializeAgents: (initialAgents: Agent[]) => void;
}

export const useAgentPresenceStore = create<AgentPresenceState>((set) => ({
  agents: [],
  setAgents: (agents) => set({ agents }),
  initializeAgents: (initialAgents) => set({ agents: initialAgents }),
}));
