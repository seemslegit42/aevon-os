
import React from 'react';
import { Progress } from '@/components/ui/progress';
import type { LucideIcon } from 'lucide-react';

export interface SystemMetric {
  id: string;
  icon: LucideIcon;
  label: string;
  value?: string | number;
  progressMax?: number;
  unit: string;
}

export interface AgentTask { /* This interface is kept for potential future use but not currently displayed */
  icon: LucideIcon;
  task: string;
  time: string;
  status: 'success' | 'failure'; 
  statusText: string;
  detailsLinkText: string;
}

interface SystemSnapshotCardContentProps {
  systemMetricsConfig: SystemMetric[];
  agentTask?: AgentTask; // Kept for future use, not displayed as per reference image
}

const SystemSnapshotCardContent: React.FC<SystemSnapshotCardContentProps> = ({ systemMetricsConfig }) => {
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
                        : metric.id === 'disk' // handles cases where disk might not be a number (though it should be)
                        ? `${metric.value}${metric.unit}` // Ensure unit is always shown for disk
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
                      className="h-1.5" // Made progress bar thinner
                      indicatorClassName="progress-custom" // Cyan color from globals.css
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
      {hasMetrics && <div className="mt-auto"></div>} {/* Pushes content up if no agent task */}
    </div>
  );
};

export default SystemSnapshotCardContent;
    