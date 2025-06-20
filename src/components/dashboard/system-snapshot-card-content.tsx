
"use client";
import React, { type ElementType } from 'react';
import { Progress } from '@/components/ui/progress';

interface MetricConfig {
  id: string;
  icon: ElementType;
  label: string;
  value: number;
  progressMax?: number;
  unit: string;
}

interface SystemSnapshotCardContentProps {
  systemMetricsConfig: MetricConfig[];
}

const SystemSnapshotCardContent: React.FC<SystemSnapshotCardContentProps> = ({ systemMetricsConfig = [] }) => {
  return (
    <div className="space-y-4">
      {systemMetricsConfig.map((metric) => {
        const MetricIcon = metric.icon;
        const progressValue = metric.progressMax ? (metric.value / metric.progressMax) * 100 : undefined;
        return (
          <div key={metric.id}>
            <div className="flex items-center justify-between text-sm mb-1">
              <div className="flex items-center">
                <MetricIcon className="w-4 h-4 mr-2 text-primary" />
                <span className="text-muted-foreground">{metric.label}</span>
              </div>
              <span className="font-semibold text-foreground">
                {metric.value}
                {metric.unit}
              </span>
            </div>
            {progressValue !== undefined && (
              <Progress value={progressValue} className="h-1.5" indicatorClassName="progress-custom" />
            )}
          </div>
        );
      })}
       {systemMetricsConfig.length === 0 && (
            <div className="text-center py-6">
                <p className="text-sm text-muted-foreground">No system metrics configured.</p>
            </div>
        )}
    </div>
  );
};

export default SystemSnapshotCardContent;
