
import { lazy, type LazyExoticComponent, type FC, type ElementType } from 'react';
import type { MicroAppRegistration } from '@/stores/micro-app.store';

// Lazy loaded card content components
const BeepCardContent = lazy(() => import('@/components/dashboard/beep-card-content'));
const LiveOrchestrationFeedCardContent = lazy(() => import('@/components/dashboard/live-orchestration-feed-card-content'));
const MicroAppsCardContent = lazy(() => import('@/components/dashboard/micro-apps-card-content'));
const LoomStudioCardContent = lazy(() => import('@/components/dashboard/loom-studio-card-content'));
const AegisSecurityCardContent = lazy(() => import('@/components/dashboard/aegis-security-card-content'));
const ArmoryMarketplaceCardContent = lazy(() => import('@/components/dashboard/armory-card-content'));
const AiInsightsCardContent = lazy(() => import('@/components/dashboard/ai-insights-card-content'));

// Icons for card titles and content
import {
  MagicWandIcon,
  ListChecksIcon,
  LayoutGridIcon,
  ChartBarIcon,
  CreditCardIcon,
  Settings2Icon,
  ShieldCheckIcon,
  BrainCircuitIcon,
  MailIcon,
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
    id: 'app-email-processor',
    title: 'Email Processor',
    description: 'Categorize emails and extract invoice data.',
    icon: MailIcon,
    component: lazy(() => import('@/components/dashboard/micro-apps/email-processor-app')),
    permissions: ['email:process', 'invoice:extract'],
    tags: ['automation', 'productivity'],
    defaultSize: { width: 450, height: 500 },
  }
];

export interface CardConfig {
  id: string;
  title: string;
  icon: ElementType;
  description?: string;
  content: LazyExoticComponent<FC<any>>;
  contentProps?: any;
  defaultLayout: { x: number; y: number; width: number; height: number; zIndex: number };
  minWidth: number;
  minHeight: number;
  isDismissible?: boolean;
  cardClassName?: string;
}

export type LayoutItem = {
    id: string; // Unique ID for the item on the dashboard (can be card ID or app instance ID)
    type: 'card' | 'app';
    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number;
    isMinimized?: boolean;
    lastHeight?: number;
} & ({
    type: 'card';
    cardId: string; // The ID from ALL_CARD_CONFIGS
} | {
    type: 'app';
    appId: string; // The ID from ALL_MICRO_APPS
});


export const ALL_CARD_CONFIGS: CardConfig[] = [
  {
    id: 'beep', title: 'BEEP Interface', icon: MagicWandIcon, isDismissible: true,
    description: "Natural language interface for tasking, automation, and information retrieval. Learns from your interactions.",
    content: BeepCardContent,
    defaultLayout: { x: 20, y: 20, width: 380, height: 280, zIndex: 1 },
    minWidth: 300, minHeight: 240, cardClassName: "flex-grow flex flex-col",
  },
  {
    id: 'loomStudio', title: 'Loom Studio', icon: Settings2Icon, isDismissible: true,
    description: "Visual workspace for designing, testing, and orchestrating complex AI agent workflows and prompt chains.",
    content: LoomStudioCardContent,
    defaultLayout: { x: 20, y: 310, width: 450, height: 350, zIndex: 3 },
    minWidth: 320, minHeight: 300,
  },
  {
    id: 'aegisSecurity', title: 'Aegis AI Security', icon: ShieldCheckIcon, isDismissible: true,
    description: "AI-powered cybersecurity. Analyzes alert data to provide summaries, identify threats, and recommend actions.",
    content: AegisSecurityCardContent,
    defaultLayout: { x: 870, y: 20, width: 380, height: 350, zIndex: 6 },
    minWidth: 300, minHeight: 280,
  },
  {
    id: 'armoryMarketplace', title: 'ΛΞVON Λrmory', icon: CreditCardIcon, isDismissible: true,
    description: "Marketplace to discover, acquire, and manage AI micro-apps and intelligent agents for your OS.",
    content: ArmoryMarketplaceCardContent,
    defaultLayout: { x: 410, y: 20, width: 450, height: 280, zIndex: 5 },
    minWidth: 300, minHeight: 280,
  },
  {
    id: 'aiInsights', title: 'AI Insights Engine', icon: BrainCircuitIcon, isDismissible: true,
    description: "Provides personalized recommendations and data-driven intelligence based on your OS activity.",
    content: AiInsightsCardContent,
    defaultLayout: { x: 870, y: 380, width: 270, height: 80, zIndex: 6 },
    minWidth: 250, minHeight: 80,
  },
  {
    id: 'liveOrchestrationFeed', title: 'Live Orchestration Feed', icon: ListChecksIcon, isDismissible: true,
    description: "A real-time feed of events and actions performed by the orchestrated AI agents and system workflows.",
    content: LiveOrchestrationFeedCardContent,
    defaultLayout: { x: 480, y: 310, width: 380, height: 200, zIndex: 8 },
    minWidth: 260, minHeight: 150,
  },
  {
    id: 'microApps', title: 'Micro-Apps Palette', icon: LayoutGridIcon, isDismissible: true,
    description: "A palette for launching available micro-apps into the Application View zone.",
    content: MicroAppsCardContent,
    defaultLayout: { x: 20, y: 670, width: 450, height: 120, zIndex: 9 }, 
    minWidth: 120, minHeight: 120,
  },
];

export const DEFAULT_LAYOUT_CONFIG: LayoutItem[] = ALL_CARD_CONFIGS.map(card => ({
    id: card.id,
    type: 'card',
    cardId: card.id,
    ...card.defaultLayout
}));
