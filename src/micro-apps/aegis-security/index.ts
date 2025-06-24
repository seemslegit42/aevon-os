import { lazy } from 'react';
import type { MicroAppRegistration } from '@/stores/micro-app.store';
import { Shield } from 'phosphor-react';

export const aegisSecurityAppConfig: MicroAppRegistration = {
  id: 'app-aegis-security',
  title: 'Aegis Security Command',
  description: 'Real-time security posture and threat analysis for your entire digital ecosystem.',
  icon: Shield,
  component: lazy(() => import('./component')),
  permissions: ['security:full-access'],
  tags: ['security', 'system', 'dashboard'],
  defaultSize: { width: 1200, height: 800 }, // Not used for page-level apps
  baseRoute: '/aegis-security',
};
