
import { lazy, type LazyExoticComponent, type FC, type ElementType } from 'react';

// Lazy loaded card content components
const BeepCardContent = lazy(() => import('@/components/dashboard/beep-card-content'));
const ApplicationViewCardContent = lazy(() => import('@/components/dashboard/application-view-card-content'));
const AgentPresenceCardContent = lazy(() => import('@/components/dashboard/agent-presence-card-content'));
const LiveOrchestrationFeedCardContent = lazy(() => import('@/components/dashboard/live-orchestration-feed-card-content'));
const MicroAppsCardContent = lazy(() => import('@/components/dashboard/micro-apps-card-content'));
const SystemSnapshotCardContent = lazy(() => import('@/components/dashboard/system-snapshot-card-content'));
const LoomStudioCardContent = lazy(() => import('@/components/dashboard/loom-studio-card-content'));
const AegisSecurityCardContent = lazy(() => import('@/components/dashboard/aegis-security-card-content'));
const ArmoryMarketplaceCardContent = lazy(() => import('@/components/dashboard/armory-card-content'));
const AiInsightsCardContent = lazy(() => import('@/components/dashboard/ai-insights-card-content'));

// Icons for card titles and content
import {
  MagicWandIcon,
  AppWindowIcon,
  UsersIcon,
  ListChecksIcon,
  LayoutGridIcon,
  BarChartBigIcon,
  CpuIcon,
  DatabaseZapIcon,
  HardDriveIcon,
  ChartBarIcon,
  CreditCardIcon,
  Settings2Icon,
  ShieldCheckIcon,
  BrainCircuitIcon,
  ClockIcon,
  RefreshCwIcon as LoaderCircleIcon,
} from '@/components/icons';

export interface CardLayoutInfo {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

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

export const ALL_CARD_CONFIGS: CardConfig[] = [
  {
    id: 'beep', title: 'BEEP Interface', icon: MagicWandIcon, isDismissible: true,
    description: "Natural language interface for tasking, automation, and information retrieval. Learns from your interactions.",
    content: BeepCardContent,
    defaultLayout: { x: 20, y: 20, width: 380, height: 280, zIndex: 1 },
    minWidth: 300, minHeight: 240, cardClassName: "flex-grow flex flex-col",
  },
  {
    id: 'systemSnapshot', title: 'System Snapshot', icon: BarChartBigIcon, isDismissible: true,
    description: "Displays key system metrics. This data feeds the adaptive AI core to ensure optimal performance.",
    content: SystemSnapshotCardContent,
    contentProps: {
      systemMetricsConfig: [
        { id: 'cpu', icon: CpuIcon, label: 'CPU Usage', value: 75, progressMax: 100, unit: '%' },
        { id: 'memory', icon: DatabaseZapIcon, label: 'Memory Usage', value: 60, progressMax: 100, unit: '%' },
        { id: 'disk', icon: HardDriveIcon, label: 'Disk Space', value: 250, progressMax: 500, unit: 'GB' },
        { id: 'agents', icon: UsersIcon, label: 'Active Agents', value: 5, unit: '' },
      ],
    },
    defaultLayout: { x: 410, y: 20, width: 320, height: 280, zIndex: 2 },
    minWidth: 260, minHeight: 240, cardClassName: "flex-grow flex flex-col",
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
    defaultLayout: { x: 870, y: 520, width: 380, height: 350, zIndex: 6 },
    minWidth: 300, minHeight: 280,
  },
  {
    id: 'armoryMarketplace', title: 'ΛΞVON Λrmory', icon: CreditCardIcon, isDismissible: true,
    description: "Marketplace to discover, acquire, and manage AI micro-apps and intelligent agents for your OS.",
    content: ArmoryMarketplaceCardContent,
    defaultLayout: { x: 740, y: 20, width: 400, height: 400, zIndex: 5 },
    minWidth: 300, minHeight: 300,
  },
  {
    id: 'aiInsights', title: 'AI Insights Engine', icon: BrainCircuitIcon, isDismissible: true,
    description: "Provides personalized recommendations and data-driven intelligence based on your OS activity.",
    content: AiInsightsCardContent,
    defaultLayout: { x: 870, y: 430, width: 270, height: 80, zIndex: 6 },
    minWidth: 250, minHeight: 80,
  },
  {
    id: 'agentPresence', title: 'Agent Presence', icon: UsersIcon, isDismissible: true,
    description: "Monitor the real-time status and activity of your intelligent AI agents as they operate and collaborate.",
    content: AgentPresenceCardContent,
    contentProps: {
      agents: [
        { id: 'agent1', name: 'Data Harvester Alpha', description: 'Continuously gathering and adapting to market sentiment for evolving reports.', status: 'Adapting', statusColor: 'text-primary-foreground', statusIcon: LoaderCircleIcon, time: 'Live', isSpinning: true },
        { id: 'agent2', name: 'Insight Engine Gamma', description: 'Dynamically processing new data streams, learning patterns.', status: 'Learning', statusColor: 'text-primary-foreground', statusIcon: ClockIcon, time: 'Live', isSpinning: false },
      ]
    },
    defaultLayout: { x: 20, y: 670, width: 550, height: 180, zIndex: 7 },
    minWidth: 300, minHeight: 150,
  },
  {
    id: 'liveOrchestrationFeed', title: 'Live Orchestration Feed', icon: ListChecksIcon, isDismissible: true,
    description: "A real-time feed of events and actions performed by the orchestrated AI agents and system workflows.",
    content: LiveOrchestrationFeedCardContent,
    contentProps: {
      feedItems: [
        { task: 'User Login Success', time: '10:35 AM', status: 'success', details: 'User john.doe logged in, profile adapted.' },
        { task: 'Adaptive Report Generation', time: '10:33 AM', status: 'success', details: 'Monthly sales report dynamically adjusted based on new data.' },
        { task: 'Data Sync Anomaly', time: '10:30 AM', status: 'failure', details: 'CRM sync deviation detected. Agent re-calibrating.' },
      ]
    },
    defaultLayout: { x: 580, y: 670, width: 560, height: 180, zIndex: 8 },
    minWidth: 260, minHeight: 150,
  },
  {
    id: 'microApps', title: 'Micro-Apps Palette', icon: LayoutGridIcon, isDismissible: true,
    description: "A palette for launching available micro-apps into the Application View zone.",
    content: MicroAppsCardContent,
    contentProps: {
      availableApps: [
        { id: 'app-analytics', icon: ChartBarIcon, label: 'Sales Analytics' },
      ]
    },
    defaultLayout: { x: 740, y: 430, width: 120, height: 230, zIndex: 9 }, 
    minWidth: 120, minHeight: 120,
  },
  {
    id: 'applicationView', title: 'Active Micro-App View', icon: AppWindowIcon, isDismissible: true,
    description: "The active viewing area for any launched micro-app. Facilitates data synergy between OS modules.",
    content: ApplicationViewCardContent,
    defaultLayout: { x: 480, y: 310, width: 450, height: 350, zIndex: 4 }, 
    minWidth: 300, minHeight: 250,
  },
];

export const DEFAULT_ACTIVE_CARD_IDS = [
  'beep',
  'systemSnapshot',
  'loomStudio',
  'aegisSecurity',
  'armoryMarketplace',
  'aiInsights',
  'agentPresence',
  'liveOrchestrationFeed',
  'microApps',
  'applicationView'
];
