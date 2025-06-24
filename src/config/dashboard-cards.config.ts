
import { lazy, type ElementType } from 'react';
import type { MicroAppRegistration } from '@/stores/micro-app.store';
import type { LayoutItem, CardConfig } from '@/types/dashboard';

// Import the new modular app configs
import { accountingAppConfig } from '@/micro-apps/accounting';
import { aegisSecurityAppConfig } from '@/micro-apps/aegis-security';
import { armoryAppConfig } from '@/micro-apps/armory';
import { salesAnalyticsAppConfig } from '@/micro-apps/sales-analytics';
import { contentCreatorAppConfig } from '@/micro-apps/content-creator';
import { armorySubscriptionsAppConfig } from '@/micro-apps/armory-subscriptions';
import { agentConfigAppConfig } from '@/micro-apps/agent-config';


// Lazy loaded card content components
const BeepCardContent = lazy(() => import('@/app/dashboard/beep-card-content'));
const LiveOrchestrationFeedCardContent = lazy(() => import('@/app/dashboard/live-orchestration-feed-card-content'));
const MicroAppsCardContent = lazy(() => import('@/app/dashboard/micro-apps-card-content'));
const AiInsightsCardContent = lazy(() => import('@/app/dashboard/ai-insights-card-content'));
const AgentPresenceCardContent = lazy(() => import('@/app/dashboard/agent-presence-card-content'));
const DevHudCardContent = lazy(() => import('@/app/dashboard/dev-hud-card-content'));

// Icons from Phosphor React
import {
    Robot,
    ChartLine,
    PuzzlePiece,
    Brain,
    Users,
    Bug,
    House,
    TreeStructure,
    Shield,
    ShoppingCart,
} from 'phosphor-react';

// =================================================================
// MAIN NAVIGATION CONFIGURATION
// =================================================================
export interface NavItemConfig {
  id: string; // The URL slug
  label: string;
  icon: ElementType;
  contextualActions?: {
    label: string;
    icon: ElementType;
    tooltip: string;
    action: () => void;
  }[];
}

export const mainNavItems: NavItemConfig[] = [
  { id: '/', label: 'Home', icon: House },
  { id: '/loom', label: 'Loom', icon: TreeStructure },
  { id: '/aegis-security', label: 'Λegis', icon: Shield },
  { id: '/armory', label: 'Armory', icon: ShoppingCart },
];

// =================================================================
// MICRO-APP REGISTRATION
// =================================================================
export const ALL_MICRO_APPS: MicroAppRegistration[] = [
  accountingAppConfig,
  aegisSecurityAppConfig,
  armoryAppConfig,
  salesAnalyticsAppConfig,
  contentCreatorAppConfig,
  armorySubscriptionsAppConfig,
  agentConfigAppConfig,
];

// =================================================================
// DASHBOARD CARD (PANEL) CONFIGURATION
// =================================================================
export const ALL_CARD_CONFIGS: CardConfig[] = [
  {
    id: 'beep',
    title: 'BEEP Chat Log',
    icon: Robot,
    isDismissible: true,
    description: "A persistent log of your conversation history with BEEP. The interactive avatar is always available at the bottom of your screen.",
    content: BeepCardContent,
    defaultLayout: { x: 20, y: 20, width: 380, height: 520 },
    minWidth: 300,
    minHeight: 480,
    cardClassName: "flex-grow flex flex-col",
  },
  {
    id: 'liveOrchestrationFeed',
    title: 'Live Orchestration Feed',
    icon: ChartLine,
    isDismissible: true,
    description: "A real-time feed of events and actions performed by the AI agents.",
    content: LiveOrchestrationFeedCardContent,
    defaultLayout: { x: 420, y: 20, width: 450, height: 250 },
    minWidth: 260,
    minHeight: 150,
  },
  {
    id: 'agentPresence',
    title: 'Agent Presence & Status',
    icon: Users,
    isDismissible: true,
    description: "Monitor the real-time status and activity of your autonomous AI agents.",
    content: AgentPresenceCardContent,
    defaultLayout: { x: 890, y: 20, width: 450, height: 250 },
    minWidth: 280,
    minHeight: 180,
  },
  {
    id: 'microApps',
    title: 'Micro-Apps Palette',
    icon: PuzzlePiece,
    isDismissible: true,
    description: "Launch available micro-apps into the workspace.",
    content: MicroAppsCardContent,
    defaultLayout: { x: 420, y: 290, width: 450, height: 250 },
    minWidth: 120,
    minHeight: 120,
  },
  {
    id: 'aiInsights',
    title: 'AI Insights Engine',
    icon: Brain,
    isDismissible: true,
    description: "Provides personalized recommendations and data-driven intelligence.",
    content: AiInsightsCardContent,
    defaultLayout: { x: 890, y: 290, width: 450, height: 250 },
    minWidth: 250,
    minHeight: 180,
  },
  {
    id: 'dev-hud',
    title: 'Developer HUD',
    icon: Bug,
    isDismissible: true,
    description: "A debugging tool for developers to inspect the micro-app registry, state, and lifecycle.",
    content: DevHudCardContent,
    defaultLayout: { x: 900, y: 560, width: 450, height: 400 },
    minWidth: 350,
    minHeight: 300,
    cardClassName: "flex-grow flex flex-col",
  },
];

// Generates the default layout by mapping over the configs.
export const DEFAULT_LAYOUT_CONFIG: LayoutItem[] = ALL_CARD_CONFIGS.filter(card => card.id !== 'dev-hud').map((card, index) => ({
    id: card.id,
    type: 'card',
    cardId: card.id,
    ...card.defaultLayout,
    zIndex: index + 1 // Ensure a default stacking order
}));
