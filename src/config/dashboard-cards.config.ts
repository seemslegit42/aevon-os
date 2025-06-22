import { lazy, type ElementType } from 'react';
import type { MicroAppRegistration } from '@/stores/micro-app.store';
import type { LayoutItem, CardConfig } from '@/types/dashboard';

// Lazy loaded card content components
const BeepCardContent = lazy(() => import('@/components/dashboard/beep-card-content'));
const LiveOrchestrationFeedCardContent = lazy(() => import('@/components/dashboard/live-orchestration-feed-card-content'));
const MicroAppsCardContent = lazy(() => import('@/components/dashboard/micro-apps-card-content'));
const AiInsightsCardContent = lazy(() => import('@/components/dashboard/ai-insights-card-content'));
const AgentPresenceCardContent = lazy(() => import('@/components/dashboard/agent-presence-card-content'));

// Icons for card titles and content
import {
  ChatbotIcon, ActivityIcon, ModularConstructionIcon, BIDashboardIcon, EditIcon, CreditCardIcon, AIBrainIcon, AccountingIcon,
  TeamIcon, ClockIcon, CheckCircleIcon, AIProcessingIcon, LoomOrchestrationIcon, ShieldIcon, ShoppingCartIcon, ZapIcon, HomeIcon,
} from '@/components/icons';

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
  { id: '/', label: 'Home', icon: HomeIcon },
  { id: '/loom-studio', label: 'Loom', icon: LoomOrchestrationIcon },
  { id: '/aegis-security', label: 'Λegis', icon: ShieldIcon },
  { id: '/armory', label: 'Armory', icon: ShoppingCartIcon },
];

// =================================================================
// MICRO-APP REGISTRATION
// =================================================================
export const ALL_MICRO_APPS: MicroAppRegistration[] = [
  {
    id: 'app-accounting',
    title: 'Accounting',
    description: 'A full-featured accounting suite for managing ledgers, invoices, payroll, and taxes.',
    icon: AccountingIcon,
    component: lazy(() => import('@/components/dashboard/micro-apps/accounting-app')),
    permissions: ['accounting:full-access'],
    tags: ['finance', 'accounting', 'business'],
    defaultSize: { width: 700, height: 520 },
  },
  {
    id: 'app-analytics',
    title: 'Sales Analytics',
    description: 'Detailed sales analytics and trends.',
    icon: BIDashboardIcon,
    component: lazy(() => import('@/components/dashboard/micro-apps/sales-analytics-app')),
    permissions: ['sales:view', 'analytics:read'],
    tags: ['analytics', 'sales'],
    defaultSize: { width: 500, height: 600 },
  },
  {
    id: 'app-content-creator',
    title: 'Content Creator',
    description: 'AI-powered assistant to generate marketing copy, blog posts, and more.',
    icon: EditIcon,
    component: lazy(() => import('@/components/dashboard/micro-apps/content-creator-app')),
    permissions: [], // No special permissions needed
    tags: ['ai', 'writing', 'marketing'],
    defaultSize: { width: 750, height: 450 },
  },
  {
    id: 'app-subscriptions',
    title: 'Armory Subscriptions',
    description: 'View and manage your AEVON OS subscription plan.',
    icon: CreditCardIcon,
    component: lazy(() => import('@/components/dashboard/micro-apps/armory-subscriptions-app')),
    permissions: [],
    tags: ['billing', 'account'],
    defaultSize: { width: 400, height: 420 },
  },
];

// =================================================================
// DASHBOARD CARD (PANEL) CONFIGURATION
// =================================================================
export const ALL_CARD_CONFIGS: CardConfig[] = [
  {
    id: 'beep',
    title: 'BEEP Interface',
    icon: ChatbotIcon,
    isDismissible: true,
    description: "Natural language interface for tasking, automation, and information retrieval.",
    content: BeepCardContent,
    defaultLayout: { x: 20, y: 20, width: 380, height: 520 },
    minWidth: 300,
    minHeight: 480,
    cardClassName: "flex-grow flex flex-col",
  },
  {
    id: 'liveOrchestrationFeed',
    title: 'Live Orchestration Feed',
    icon: ActivityIcon,
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
    icon: TeamIcon,
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
    icon: ModularConstructionIcon,
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
    icon: AIBrainIcon,
    isDismissible: true,
    description: "Provides personalized recommendations and data-driven intelligence.",
    content: AiInsightsCardContent,
    defaultLayout: { x: 890, y: 290, width: 450, height: 250 },
    minWidth: 250,
    minHeight: 180,
  },
];

// Generates the default layout by mapping over the configs.
export const DEFAULT_LAYOUT_CONFIG: LayoutItem[] = ALL_CARD_CONFIGS.map((card, index) => ({
    id: card.id,
    type: 'card',
    cardId: card.id,
    ...card.defaultLayout,
    zIndex: index + 1 // Ensure a default stacking order
}));
