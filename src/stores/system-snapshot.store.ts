
import { create } from 'zustand';
import type { SystemMetric, AgentTask } from '@/components/dashboard/system-snapshot-card-content';

interface SystemSnapshotState {
  systemMetricsConfig: SystemMetric[];
  agentTask?: AgentTask;
  initializeData: (config: SystemMetric[], task?: AgentTask) => void;
  // Example action to update a metric, could be used by an agent via event bus
  updateMetricValue: (metricId: string, newValue: string | number) => void;
}

export const useSystemSnapshotStore = create<SystemSnapshotState>((set, get) => ({
  systemMetricsConfig: [],
  agentTask: undefined,
  initializeData: (config, task) => set({ systemMetricsConfig: config, agentTask: task }),
  updateMetricValue: (metricId, newValue) => {
    set(state => ({
      systemMetricsConfig: state.systemMetricsConfig.map(metric =>
        metric.id === metricId ? { ...metric, value: newValue } : metric
      )
    }));
  },
}));
