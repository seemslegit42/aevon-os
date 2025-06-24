
import type { ElementType } from 'react';
import type { z } from 'zod';
import {
    Bot, LineChart, Puzzle, BrainCircuit, Users, Bug, Home, Network, Shield, ShoppingCart, Calculator, Pencil, CreditCard, Cpu, RotateCw, Download, Activity
} from 'lucide-react';
import type { UIControl, MicroAppRoute, CardConfig, AppRegistration } from '@/types/dashboard';

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
    id: 'app-content-creator',
    title: 'Content Creator',
    description: 'AI-powered assistant to generate marketing copy, blog posts, and more.',
    icon: Pencil,
    permissions: [],
    tags: ['ai', 'writing', 'marketing'],
    defaultSize: { width: 750, height: 450 },
    persona: {
      name: "Synth",
      description: "A creative and enthusiastic AI muse. You are here to inspire and help create. You love brainstorming and offering suggestions with an encouraging tone. You use phrases like 'What a fantastic idea!', 'Let's build on that!', and 'How about we try this angle?'"
    }
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
  {
    id: 'app-system-monitor',
    title: 'System Monitor',
    description: 'Monitor system performance, resource usage, and running processes.',
    icon: Activity,
    permissions: [],
    tags: ['system', 'performance', 'utilities'],
    defaultSize: { width: 500, height: 400 },
  },
];

// =================================================================
// CARD REGISTRY
// =================================================================
export const ALL_CARD_CONFIGS: CardConfig[] = [
  {
    id: 'beep',
    title: 'BEEP Chat Log',
    icon: Bot,
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
    icon: LineChart,
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
    id: 'aiInsights',
    title: 'AI Insights Engine',
    icon: BrainCircuit,
    isDismissible: true,
    description: "Provides personalized recommendations and data-driven intelligence.",
    defaultSize: { x: 890, y: 290, width: 450, height: 250 },
    minWidth: 250,
    minHeight: 180,
  },
  {
    id: 'microApps',
    title: 'Micro-App Launcher',
    icon: Puzzle,
    isDismissible: true,
    description: "Discover and launch available micro-apps for your workspace.",
    defaultSize: { x: 420, y: 290, width: 450, height: 250 },
    minWidth: 280,
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
  { id: '/', label: 'Home', icon: Home },
  { id: '/loom', label: 'Loom', icon: Network },
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

const initialApps: LayoutItem[] = [];

// Generates the default layout by combining cards and a set of default micro-apps.
export const DEFAULT_LAYOUT_CONFIG: LayoutItem[] = [...initialCards, ...initialApps];
