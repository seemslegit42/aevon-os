
import React from 'react';
import { Progress } from '@/components/ui/progress';
import type { LucideIcon } from 'lucide-react';
import { CheckCircle, ChevronDown } from 'lucide-react'; // Added for AgentTask
import { Separator } from '@/components/ui/separator'; // Added for visual separation

export interface SystemMetric {
  id: string;
  icon: LucideIcon;
  label: string;
  value: string | number;
  progressMax?: number;
  unit: string;
}

export interface AgentTask {
  icon: LucideIcon;
  task: string;
  time: string;
  status: 'success' | 'failure'; // Or more statuses if needed
  statusText: string;
  detailsLinkText: string;
}

interface SystemSnapshotCardContentProps {
  systemMetricsConfig: SystemMetric[];
  agentTask?: AgentTask; // Optional agent task
}

const SystemSnapshotCardContent: React.FC<SystemSnapshotCardContentProps> = ({ systemMetricsConfig, agentTask }) => {
  return (
    <div className="space-y-3 p-1 flex flex-col h-full">
      <ul className="space-y-3">
        {systemMetricsConfig.map(metric => (
          <li key={metric.id} className="text-sm">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center text-muted-foreground">
                <metric.icon className="w-4 h-4 mr-2 text-primary" />
                <span>{metric.label}</span>
              </div>
              {metric.id === 'agents' ? (
                 <span className="bg-accent text-accent-foreground px-1.5 py-0.5 rounded-full text-xs font-medium">
                   {metric.value}
                 </span>
              ) : (
                <span className="font-medium text-foreground">
                  {metric.progressMax && metric.unit === '%' ? `${metric.value}%` : ''}
                  {metric.progressMax && metric.unit === 'GB' && metric.label === 'Disk Usage' ? `${metric.value}${metric.unit} / ${metric.progressMax && metric.progressMax >= 1000 ? (metric.progressMax / 1000) + 'TB' : metric.progressMax + 'GB'}` : ''}
                  {metric.progressMax && metric.unit === 'GB' && metric.label !== 'Disk Usage' ? `${metric.value}${metric.unit} / ${metric.progressMax}GB` : ''}
                  {!metric.progressMax && metric.unit.includes('GB')? `${metric.value} ${metric.unit}` : ''}
                  {!metric.progressMax && metric.unit === '' ? metric.value : ''}
                </span>
              )}
            </div>
            {metric.progressMax && (
                <Progress 
                    value={typeof metric.value === 'number' ? (metric.id === 'disk' ? (metric.value / metric.progressMax) * 100 : metric.value) : 0} 
                    className="h-2 [&>div]:bg-primary" 
                />
            )}
          </li>
        ))}
      </ul>

      {agentTask && (
        <>
          <Separator className="my-3 bg-border/50" />
          <div className="p-1 rounded-md bg-primary/5 dark:bg-black/20">
            <div className="flex items-start justify-between mb-1">
              <div className="flex items-center">
                 {agentTask.status === 'success' ? <CheckCircle className="w-5 h-5 mr-2 text-secondary shrink-0" /> : <X className="w-5 h-5 mr-2 text-destructive shrink-0" />}
                <div>
                  <p className="font-semibold text-foreground text-sm">{agentTask.task}</p>
                  <p className="text-xs text-muted-foreground">{agentTask.time}</p>
                </div>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${agentTask.status === 'success' ? 'bg-secondary text-primary-foreground' : 'bg-destructive text-destructive-foreground'}`}>
                {agentTask.statusText}
              </span>
            </div>
             <button className={`text-xs ${agentTask.status === 'success' ? 'text-secondary' : 'text-destructive'} hover:underline flex items-center mt-1`}>
              {agentTask.detailsLinkText} <ChevronDown className="w-3 h-3 ml-1" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SystemSnapshotCardContent;
