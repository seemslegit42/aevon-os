
import { lazy, type LazyExoticComponent, type FC, type ElementType } from 'react';
import type { MicroAppRegistration } from '@/stores/micro-app.store';
import type { LayoutItem, CardConfig } from '@/types/dashboard';

// Lazy loaded card content components
const BeepCardContent = lazy(() => import('@/components/dashboard/beep-card-content'));
const LiveOrchestrationFeedCardContent = lazy(() => import('@/components/dashboard/live-orchestration-feed-card-content'));
const MicroAppsCardContent = lazy(() => import('@/components/dashboard/micro-apps-card-content'));
const LoomStudioCardContent = lazy(() => import('@/components/dashboard/loom-studio-card-content'));
const AiInsightsCardContent = lazy(() => import('@/components/dashboard/ai-insights-card-content'));
const AegisSecurityCardContent = lazy(() => import('@/components/dashboard/aegis-security-card-content'));
const AgentPresenceCardContent = lazy(() => import('@/components/dashboard/agent-presence-card-content'));


// Icons for card titles and content
import {
  MagicWandIcon,
  ListChecksIcon,
  LayoutGridIcon,
  ChartBarIcon,
  GitForkIcon,
  ShieldCheckIcon,
  BrainCircuitIcon,
  LayersIcon,
  PenSquareIcon,
  CreditCardIcon,
  UsersRoundIcon,
  ClockIcon,
  CheckCircleIcon,
  LoaderIcon,
} from '@/components/icons';


// Define all available micro-apps for registration
export const ALL_MICRO_APPS: MicroAppRegistration[] = [
  {
    id: 'app-analytics',
    title: 'Sales Analytics',
    description: 'Detailed sales analytics and trends.',
    icon: ChartBarIcon,
    component: lazy(() => import('@/components/dashboard/micro-apps/sales-analytics-app')),
    permissions: ['sales:view', 'analytics:read'],
    tags: ['analytics', 'sales'],
    defaultSize: { width: 500, height: 600 },
  },
  {
    id: 'app-content-creator',
    title: 'Content Creator',
    description: 'AI-powered assistant to generate marketing copy, blog posts, and more.',
    icon: PenSquareIcon,
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

const mockAgents = [
    { 
        id: 'agent1', name: 'Invoice Processor', description: 'Monitoring incoming documents.', 
        status: 'Idle', statusColor: 'text-chart-4', statusIcon: ClockIcon, time: '1m ago' 
    },
    { 
        id: 'agent2', name: 'Security Analyst', description: 'Analyzing login patterns.', 
        status: 'Processing', statusColor: 'text-accent', statusIcon: LoaderIcon, isSpinning: true, time: 'Just now' 
    },
    { 
        id: 'agent3', name: 'Data Synchronizer', description: 'Last sync successful.', 
        status: 'Completed', statusColor: 'text-chart-2', statusIcon: CheckCircleIcon, time: '15m ago' 
    },
];


export const ALL_CARD_CONFIGS: CardConfig[] = [
  {
    id: 'beep', title: 'BEEP Interface', icon: MagicWandIcon, isDismissible: true,
    description: "Natural language interface for tasking, automation, and information retrieval. Learns from your interactions.",
    content: BeepCardContent,
    defaultLayout: { x: 20, y: 20, width: 380, height: 500, zIndex: 1 },
    minWidth: 300, minHeight: 480, cardClassName: "flex-grow flex flex-col",
  },
  {
    id: 'loomStudio', title: 'Loom Studio', icon: GitForkIcon, isDismissible: true,
    description: "Visual workspace for designing, testing, and orchestrating complex AI agent workflows and prompt chains.",
    content: LoomStudioCardContent,
    defaultLayout: { x: 410, y: 20, width: 450, height: 500, zIndex: 2 },
    minWidth: 320, minHeight: 300,
  },
  {
    id: 'aiInsights', title: 'AI Insights Engine', icon: BrainCircuitIcon, isDismissible: true,
    description: "Provides personalized recommendations and data-driven intelligence based on your OS activity.",
    content: AiInsightsCardContent,
    defaultLayout: { x: 870, y: 530, width: 450, height: 210, zIndex: 5 },
    minWidth: 250, minHeight: 180,
  },
  {
    id: 'liveOrchestrationFeed', title: 'Live Orchestration Feed', icon: ListChecksIcon, isDismissible: true,
    description: "A real-time feed of events and actions performed by the orchestrated AI agents and system workflows.",
    content: LiveOrchestrationFeedCardContent,
    defaultLayout: { x: 870, y: 20, width: 450, height: 500, zIndex: 6 },
    minWidth: 260, minHeight: 150,
  },
  {
    id: 'microApps', title: 'Micro-Apps Palette', icon: LayoutGridIcon, isDismissible: true,
    description: "A palette for launching available micro-apps into the Application View zone.",
    content: MicroAppsCardContent,
    defaultLayout: { x: 20, y: 530, width: 380, height: 210, zIndex: 7 }, 
    minWidth: 120, minHeight: 120,
  },
  {
    id: 'agentPresence',
    title: 'Agent Presence & Status',
    icon: UsersRoundIcon,
    isDismissible: true,
    description: "Monitor the real-time status and activity of your autonomous AI agents.",
    content: AgentPresenceCardContent,
    contentProps: { agents: mockAgents },
    defaultLayout: { x: 410, y: 530, width: 450, height: 210, zIndex: 8 },
    minWidth: 280,
    minHeight: 180,
  },
];

export const DEFAULT_LAYOUT_CONFIG: LayoutItem[] = ALL_CARD_CONFIGS.map(card => ({
    id: card.id,
    type: 'card',
    cardId: card.id,
    ...card.defaultLayout
}));
