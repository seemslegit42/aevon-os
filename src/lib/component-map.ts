
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

// Register Micro-App Components
componentMap.set('app-accounting', lazy(() => import('@/micro-apps/accounting/component')));
componentMap.set('app-aegis-security', lazy(() => import('@/micro-apps/aegis-security/component')));
componentMap.set('app-armory', lazy(() => import('@/micro-apps/armory/component')));
componentMap.set('app-analytics', lazy(() => import('@/micro-apps/sales-analytics/component')));
componentMap.set('app-content-creator', lazy(() => import('@/micro-apps/content-creator/component')));
componentMap.set('app-subscriptions', lazy(() => import('@/micro-apps/armory-subscriptions/component')));
componentMap.set('app-agent-config', lazy(() => import('@/micro-apps/agent-config/component')));
componentMap.set('app-system-monitor', lazy(() => import('@/micro-apps/system-monitor/component')));
