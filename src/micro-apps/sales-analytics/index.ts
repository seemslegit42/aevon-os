
import type { MicroAppRegistration } from '@/stores/micro-app.store';
import { LineChart, RotateCw, Download } from 'lucide-react';

export const salesAnalyticsAppConfig: MicroAppRegistration = {
  id: 'app-analytics',
  title: 'Sales Analytics',
  description: 'Detailed sales analytics and trends.',
  icon: LineChart,
  permissions: ['sales:view', 'analytics:read'],
  tags: ['analytics', 'sales'],
  defaultSize: { width: 500, height: 600 },
  controls: [
    {
      id: 'refresh',
      label: 'Refresh',
      icon: RotateCw,
      tooltip: 'Refresh sales data'
    },
    {
      id: 'export',
      label: 'Export',
      icon: Download,
      tooltip: 'Export data as CSV'
    }
  ]
};
