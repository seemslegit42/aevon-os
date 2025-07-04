
import { lazy, type LazyExoticComponent, type ComponentType } from 'react';

// This map centralizes all lazy-loaded components, breaking circular dependencies.
// It maps a component's ID (from app-registry) to its actual implementation.
export const componentMap = new Map<string, LazyExoticComponent<ComponentType<any>>>();

// Register Card Content Components
componentMap.set('beep', lazy(() => import('@/micro-apps/beep-card/component')));
componentMap.set('liveOrchestrationFeed', lazy(() => import('@/micro-apps/live-orchestration-feed/component')));
componentMap.set('aiInsights', lazy(() => import('@/micro-apps/ai-insights/component')));
componentMap.set('agentPresence', lazy(() => import('@/micro-apps/agent-presence/component')));
componentMap.set('dev-hud', lazy(() => import('@/micro-apps/dev-hud/component')));
componentMap.set('microApps', lazy(() => import('@/micro-apps/micro-apps-palette/component')));
componentMap.set('action-console', lazy(() => import('@/micro-apps/action-console/component')));

// Register Micro-App Components
componentMap.set('app-accounting', lazy(() => import('@/micro-apps/accounting/component')));
componentMap.set('app-armory', lazy(() => import('@/micro-apps/armory/component')));
componentMap.set('app-content-creator', lazy(() => import('@/micro-apps/content-creator/component')));
componentMap.set('app-agent-config', lazy(() => import('@/micro-apps/agent-config/component')));
componentMap.set('app-system-monitor', lazy(() => import('@/micro-apps/system-monitor/component')));
componentMap.set('app-vin-compliance', lazy(() => import('@/micro-apps/vin-compliance/component')));
