
import React from 'react';
import { Progress } from '@/components/ui/progress';
import type { LucideIcon } from 'lucide-react';
import { CheckCircle, ChevronDown, X } from 'lucide-react'; 
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

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
  systemMetricsConfig: SystemMetric[];
  agentTask?: AgentTask; 
}

const SystemSnapshotCardContent: React.FC<SystemSnapshotCardContentProps> = ({ systemMetricsConfig, agentTask }) => {
  const hasMetrics = systemMetricsConfig && systemMetricsConfig.length > 0;

  return (
    <div className="space-y-3 p-1 flex flex-col h-full">
      {hasMetrics ? (
        <ul className="space-y-3.5"> {/* Increased spacing slightly */}
          {systemMetricsConfig.map(metric => (
            <li key={metric.id} className="text-sm">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center text-primary"> {/* Icon and label color changed to primary */}
                  <metric.icon className="w-4 h-4 mr-2" />
                  <span className="font-medium">{metric.label}</span>
                </div>
                {metric.value !== undefined ? (
                  metric.id === 'agents' ? (
                    <span className="bg-accent text-accent-foreground px-2 py-0.5 rounded-full text-xs font-bold"> {/* Made badge bolder */}
                      {metric.value}
                    </span>
                  ) : (
                    <span className="font-medium text-foreground">
                      {/* Logic to display GB/TB correctly as in image */}
                      {metric.id === 'disk' && typeof metric.value === 'number' && metric.progressMax
                        ? `${metric.value}${metric.unit} / ${metric.progressMax}${metric.unit}`
                        : metric.value}
                      {metric.id !== 'disk' && metric.id !== 'agents' && typeof metric.value === 'string' && metric.unit === '' 
                        ? metric.value 
                        : ''}
                       {metric.id !== 'disk' && metric.id !== 'agents' && typeof metric.value === 'number' && metric.unit !== '%' && metric.unit !== ''
                        ? `${metric.value} ${metric.unit}`
                        : ''}
                    </span>
                  )
                ) : (
                  <span className="font-medium text-muted-foreground">N/A</span>
                )}
              </div>
              {metric.progressMax && metric.value !== undefined && metric.id === 'disk' && ( // Only show progress for disk usage as per image
                  <Progress 
                      value={typeof metric.value === 'number' ? (metric.value / metric.progressMax) * 100 : 0} 
                      // className="h-2 [&>div]:bg-secondary" // Original
                      className="h-2" // Remove default background, apply custom class to indicator
                      indicatorClassName="progress-custom" // Custom class for blue/cyan indicator
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

      {/* Agent task section is not visible in the reference image's System Snapshot, so removing it */}
      {/* {agentTask && (
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
              <span className={cn(
                `text-xs font-medium px-2.5 py-1 rounded-full`,
                agentTask.status === 'success' ? 'badge-success' : 'badge-failure'
              )}>
                {agentTask.statusText}
              </span>
            </div>
             <button className={cn(
                `text-xs hover:underline flex items-center mt-1`,
                agentTask.status === 'success' ? 'details-link-success' : 'details-link-failure'
              )}>
              {agentTask.detailsLinkText} <ChevronDown className="w-3 h-3 ml-1" />
            </button>
          </div>
        </>
      )} */}
      {!agentTask && !hasMetrics && <div className="flex-grow"></div>} 
      {!agentTask && hasMetrics && <div className="mt-auto"></div>}
    </div>
  );
};

export default SystemSnapshotCardContent;
