
import React from 'react';
import { Progress } from '@/components/ui/progress';
import type { LucideIcon } from 'lucide-react';

export interface SystemMetric {
  id: string;
  icon: LucideIcon;
  label: string;
  value: string | number;
  progressMax?: number;
  unit: string;
}

interface SystemSnapshotCardContentProps {
  systemMetricsConfig: SystemMetric[];
}

const SystemSnapshotCardContent: React.FC<SystemSnapshotCardContentProps> = ({ systemMetricsConfig }) => {
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
                  {metric.progressMax && metric.unit === 'GB' && metric.label === 'Disk Usage' ? `${metric.value}${metric.unit} / ${metric.progressMax / 1000}TB` : ''}
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
    </div>
  );
};

export default SystemSnapshotCardContent;

    