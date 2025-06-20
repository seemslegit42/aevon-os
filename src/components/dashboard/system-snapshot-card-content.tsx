
import React, { useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import type { LucideIcon } from 'lucide-react';
import type { Emitter } from 'mitt';
import { useSystemSnapshotStore } from '@/stores/system-snapshot.store';

export interface SystemMetric {
  id: string;
  icon: LucideIcon;
  label: string;
  value?: string | number;
  progressMax?: number;
  unit: string;
}

export interface AgentTask { 
  icon: LucideIcon;
  task: string;
  time: string;
  status: 'success' | 'failure';
  statusText: string;
  detailsLinkText: string;
}

interface SystemSnapshotCardContentProps {
  initialSystemMetricsConfig: SystemMetric[];
  initialAgentTask?: AgentTask;
  eventBusInstance?: Emitter<any>;
}

const SystemSnapshotCardContent: React.FC<SystemSnapshotCardContentProps> = ({ 
  initialSystemMetricsConfig, 
  initialAgentTask, 
  eventBusInstance 
}) => {
  const systemMetricsConfig = useSystemSnapshotStore((state) => state.systemMetricsConfig);
  const agentTask = useSystemSnapshotStore((state) => state.agentTask);
  const initializeData = useSystemSnapshotStore((state) => state.initializeData);
  // const updateMetricValue = useSystemSnapshotStore((state) => state.updateMetricValue); // Example for agent interaction

  useEffect(() => {
    initializeData(initialSystemMetricsConfig, initialAgentTask);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSystemMetricsConfig, initialAgentTask]);

  // Example of agent interaction via event bus
  // useEffect(() => {
  //   const handleUpdateMetric = (payload: { metricId: string, value: string | number }) => {
  //     updateMetricValue(payload.metricId, payload.value);
  //   };
  //   eventBusInstance?.on('systemsnapshot:updateMetric', handleUpdateMetric as any);
  //   return () => {
  //     eventBusInstance?.off('systemsnapshot:updateMetric', handleUpdateMetric as any);
  //   };
  // }, [eventBusInstance, updateMetricValue]);


  const hasMetrics = systemMetricsConfig && systemMetricsConfig.length > 0;

  return (
    <div className="space-y-3 p-1 flex flex-col h-full">
      {hasMetrics ? (
        <ul className="space-y-3.5">
          {systemMetricsConfig.map(metric => (
            <li key={metric.id} className="text-sm">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center text-primary">
                  <metric.icon className="w-4 h-4 mr-2" />
                  <span className="font-medium text-foreground/90">{metric.label}</span>
                </div>
                {metric.value !== undefined ? (
                  metric.id === 'agents' ? (
                    <span className="bg-accent text-accent-foreground px-2 py-0.5 rounded-full text-xs font-bold">
                      {metric.value}
                    </span>
                  ) : (
                    <span className="font-medium text-foreground text-xs">
                      {metric.id === 'disk' && typeof metric.value === 'number' && metric.progressMax
                        ? `${metric.value}${metric.unit} / ${metric.progressMax}${metric.unit}`
                        : metric.id === 'disk' 
                        ? `${metric.value}${metric.unit}` 
                        : typeof metric.value === 'string' && metric.unit === ''
                        ? metric.value
                        : typeof metric.value === 'number' && metric.unit !== '%' && metric.unit !== ''
                        ? `${metric.value} ${metric.unit}`
                        : String(metric.value)
                      }
                    </span>
                  )
                ) : (
                  <span className="font-medium text-muted-foreground">N/A</span>
                )}
              </div>
              {metric.progressMax && metric.value !== undefined && metric.id === 'disk' && (
                  <Progress
                      value={typeof metric.value === 'number' ? (metric.value / metric.progressMax) * 100 : 0}
                      className="h-1.5" 
                      indicatorClassName="progress-custom" 
                  />
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex items-center justify-center flex-grow">
          <p className="text-sm text-muted-foreground">System metrics not available.</p>
        </div>
      )}
      {hasMetrics && <div className="mt-auto"></div>} 
    </div>
  );
};

export default SystemSnapshotCardContent;
