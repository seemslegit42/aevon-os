
import { lazy } from 'react';
import type { MicroAppRegistration } from '@/stores/micro-app.store';
import { ChartBar, ArrowClockwise, DownloadSimple } from 'phosphor-react';

export const salesAnalyticsAppConfig: MicroAppRegistration = {
  id: 'app-analytics',
  title: 'Sales Analytics',
  description: 'Detailed sales analytics and trends.',
  icon: ChartBar,
  component: lazy(() => import('./component')),
  permissions: ['sales:view', 'analytics:read'],
  tags: ['analytics', 'sales'],
  defaultSize: { width: 500, height: 600 },
  controls: [
    {
      id: 'refresh',
      label: 'Refresh',
      icon: ArrowClockwise,
      tooltip: 'Refresh sales data'
    },
    {
      id: 'export',
      label: 'Export',
      icon: DownloadSimple,
      tooltip: 'Export data as CSV'
    }
  ]
};
