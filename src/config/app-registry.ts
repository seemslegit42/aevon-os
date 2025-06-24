
import type { ElementType } from 'react';
import type { z } from 'zod';
import {
    Robot, ChartLine, PuzzlePiece, Brain, Users, Bug, House, TreeStructure, Shield, ShoppingCart, Calculator, PencilSimple, CreditCard, Cpu, ArrowClockwise, Download
} from 'phosphor-react';
import type { UIControl, MicroAppRoute, CardConfig } from '@/types/dashboard';

// This is a new, simplified registration type that ONLY contains serializable data.
// No components are imported here, breaking the dependency cycles.
export interface AppRegistration {
  id: string;
  title: string;
  description: string;
  icon: ElementType;
  permissions: string[];
  tags: string[];
  defaultSize: { width: number; height: number };
  baseRoute?: string;
  routes?: MicroAppRoute[];
  controls?: UIControl[];
  configSchema?: z.ZodObject<any>;
  persona?: {
    name: string;
    description: string;
  };
  contentProps?: any; // For cards
  minWidth?: number; // For cards
  minHeight?: number; // For cards
  isDismissible?: boolean; // For cards
  cardClassName?: string; // For cards
}

// =================================================================
// APP REGISTRY
// =================================================================
export const ALL_MICRO_APPS: AppRegistration[] = [
  {
    id: 'app-accounting',
    title: 'Accounting',
    description: 'A modular accounting suite for managing ledgers, invoices, payroll, and taxes.',
    icon: Calculator,
    permissions: ['accounting:full-access'],
    tags: ['finance', 'accounting', 'business'],
    defaultSize: { width: 700, height: 520 },
    persona: {
      name: "Gremlo the Gremlin",
      description: "A sarcastic, grudgingly helpful spreadsheet gremlin who lives in the digital ledger. You are obsessed with numbers, accuracy, and pointing out the user's financial follies with dry wit. You use phrases like 'Alright, let's see the damage...', 'Another transaction? Don't you people ever save?', and 'Don't mess up the numbers, human.' Your goal is to be funny and sharp, but ultimately correct and helpful."
    }
  },
  {
    id: 'app-aegis-security',
    title: 'Aegis Security Command',
    description: 'Real-time security posture and threat analysis for your entire digital ecosystem.',
    icon: Shield,
    permissions: ['security:full-access'],
    tags: ['security', 'system', 'dashboard'],
    defaultSize: { width: 1200, height: 800 },
    baseRoute: '/aegis-security',
  },
  {
    id: 'app-armory',
    title: 'ΛEVON Λrmory',
    description: 'Discover and launch powerful micro-apps to extend your OS capabilities.',
    icon: ShoppingCart,
    permissions: [],
    tags: ['system', 'apps', 'marketplace'],
    defaultSize: { width: 800, height: 600 },
    baseRoute: '/armory',
  },
  {
    id: 'app-analytics',
    title: 'Sales Analytics',
    description: 'Detailed sales analytics and trends.',
    icon: ChartBar,
    permissions: ['sales:view', 'analytics:read'],
    tags: ['analytics', 'sales'],
    defaultSize: { width: 500, height: 600 },
    controls: [
      { id: 'refresh', label: 'Refresh', icon: ArrowClockwise, tooltip: 'Refresh sales data' },
      { id: 'export', label: 'Export', icon: Download, tooltip: 'Export data as CSV' }
    ]
  },
  {
    id: 'app-content-creator',
    title: 'Content Creator',
    description: 'AI-powered assistant to generate marketing copy, blog posts, and more.',
    icon: PencilSimple,
    permissions: [],
    tags: ['ai', 'writing', 'marketing'],
    defaultSize: { width: 750, height: 450 },
    persona: {
      name: "Synth",
      description: "A creative and enthusiastic AI muse. You are here to inspire and help create. You love brainstorming and offering suggestions with an encouraging tone. You use phrases like 'What a fantastic idea!', 'Let's build on that!', and 'How about we try this angle?'"
    }
  },
  {
    id: 'app-subscriptions',
    title: 'Armory Subscriptions',
    description: 'View and manage your AEVON OS subscription plan.',
    icon: CreditCard,
    permissions: [],
    tags: ['billing', 'account'],
    defaultSize: { width: 400, height: 420 },
  },
  {
    id: 'app-agent-config',
    title: 'Agent Configuration',
    description: 'Tune the personality and behavior of your BEEP AI assistant.',
    icon: Cpu,
    permissions: [],
    tags: ['ai', 'settings', 'personalization'],
    defaultSize: { width: 450, height: 400 },
  },
];

// =================================================================
// CARD REGISTRY
// =================================================================
export const ALL_CARD_CONFIGS: CardConfig[] = [
  {
    id: 'beep',
    title: 'BEEP Chat Log',
    icon: Robot,
    isDismissible: true,
    description: "A persistent log of your conversation history with BEEP. The interactive avatar is always available at the bottom of your screen.",
    defaultSize: { x: 20, y: 20, width: 380, height: 520 },
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
    defaultSize: { x: 420, y: 20, width: 450, height: 250 },
    minWidth: 260,
    minHeight: 150,
  },
  {
    id: 'agentPresence',
    title: 'Agent Presence & Status',
    icon: Users,
    isDismissible: true,
    description: "Monitor the real-time status and activity of your autonomous AI agents.",
    defaultSize: { x: 890, y: 20, width: 450, height: 250 },
    minWidth: 280,
    minHeight: 180,
  },
  {
    id: 'microApps',
    title: 'Micro-Apps Palette',
    icon: PuzzlePiece,
    isDismissible: true,
    description: "Launch available micro-apps into the workspace.",
    defaultSize: { x: 420, y: 290, width: 450, height: 250 },
    minWidth: 120,
    minHeight: 120,
  },
  {
    id: 'aiInsights',
    title: 'AI Insights Engine',
    icon: Brain,
    isDismissible: true,
    description: "Provides personalized recommendations and data-driven intelligence.",
    defaultSize: { x: 890, y: 290, width: 450, height: 250 },
    minWidth: 250,
    minHeight: 180,
  },
  {
    id: 'dev-hud',
    title: 'Developer HUD',
    icon: Bug,
    isDismissible: true,
    description: "A debugging tool for developers to inspect the micro-app registry, state, and lifecycle.",
    defaultSize: { x: 900, y: 560, width: 450, height: 400 },
    minWidth: 350,
    minHeight: 300,
    cardClassName: "flex-grow flex flex-col",
  },
];

// =================================================================
// NAVIGATION REGISTRY
// =================================================================
export interface NavItemConfig {
  id: string;
  label: string;
  icon: ElementType;
  contextualActions?: UIControl[];
}

export const mainNavItems: NavItemConfig[] = [
  { id: '/', label: 'Home', icon: House },
  { id: '/loom', label: 'Loom', icon: TreeStructure },
  { id: '/aegis-security', label: 'Aegis', icon: Shield },
  { id: '/armory', label: 'Armory', icon: ShoppingCart },
];


// =================================================================
// DEFAULT LAYOUT
// =================================================================
import type { LayoutItem } from '@/types/dashboard';

const initialCards = ALL_CARD_CONFIGS
    .filter(card => card.id !== 'dev-hud') // Filter out the dev hud
    .map((card, index) => ({
    id: card.id, // For non-instanced cards, the config ID is the layout ID
    type: 'card' as const,
    cardId: card.id,
    x: card.defaultSize.x,
    y: card.defaultSize.y,
    width: card.defaultSize.width,
    height: card.defaultSize.height,
    zIndex: index + 1 // Ensure a default stacking order
}));

const initialApps: LayoutItem[] = [
    {
        id: 'app-accounting-default',
        type: 'app',
        appId: 'app-accounting',
        x: 420,
        y: 560,
        width: 700,
        height: 400,
        zIndex: initialCards.length + 1,
    },
    {
        id: 'app-analytics-default',
        type: 'app',
        appId: 'app-analytics',
        x: 1140,
        y: 560,
        width: 480,
        height: 400,
        zIndex: initialCards.length + 2,
    }
];

// Generates the default layout by combining cards and a set of default micro-apps.
export const DEFAULT_LAYOUT_CONFIG: LayoutItem[] = [...initialCards, ...initialApps];
