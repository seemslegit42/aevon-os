
import type { LazyExoticComponent, FC, ElementType } from 'react';

// Lazy loaded card content components
const AiAssistantCardContent = (() => import('@/components/dashboard/ai-assistant-card-content')) as unknown as LazyExoticComponent<FC<any>>;
const ApplicationViewCardContent = (() => import('@/components/dashboard/application-view-card-content')) as unknown as LazyExoticComponent<FC<any>>;
const AgentPresenceCardContent = (() => import('@/components/dashboard/agent-presence-card-content')) as unknown as LazyExoticComponent<FC<any>>;
const LiveOrchestrationFeedCardContent = (() => import('@/components/dashboard/live-orchestration-feed-card-content')) as unknown as LazyExoticComponent<FC<any>>;
const MicroAppsCardContent = (() => import('@/components/dashboard/micro-apps-card-content')) as unknown as LazyExoticComponent<FC<any>>;
const SystemSnapshotCardContent = (() => import('@/components/dashboard/system-snapshot-card-content')) as unknown as LazyExoticComponent<FC<any>>;


// Icons for card titles and content
import {
  Sparkles,
  AppWindow,
  Users,
  ListChecks,
  LayoutGrid,
  Activity,
  Cpu,
  Database,
  Server,
  Zap,
  BarChart2,
  ShoppingCart as ArmoryIcon, // Alias for MicroApps
  Settings as LoomIcon,       // Alias for MicroApps
  Shield as AegisIcon,        // Alias for MicroApps
  Clock,
  LoaderCircle,
  AlertTriangle,
} from 'lucide-react';

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
    id: 'aiAssistant', title: 'AI Assistant', icon: Sparkles, isDismissible: true,
    content: AiAssistantCardContent,
    contentProps: {
      placeholderInsight: "Analyze product sales, compare revenue, or ask for insights."
    },
    defaultLayout: { x: 20, y: 20, width: 420, height: 260, zIndex: 1 }, // Adjusted width/height
    minWidth: 300, minHeight: 240, cardClassName: "flex-grow flex flex-col",
  },
  {
    id: 'applicationView', title: 'Application View', icon: AppWindow, isDismissible: true,
    content: ApplicationViewCardContent,
    defaultLayout: { x: 20, y: 290, width: 420, height: 260, zIndex: 2 }, // Adjusted Y, width/height
    minWidth: 300, minHeight: 180,
  },
  {
    id: 'systemSnapshot', title: 'System Snapshot', icon: Activity, isDismissible: true,
    content: SystemSnapshotCardContent,
    contentProps: {
      systemMetricsConfig: [
        { id: 'cpu', icon: Cpu, label: 'CPU Usage', value: 75, progressMax: 100, unit: '%' },
        { id: 'memory', icon: Database, label: 'Memory Usage', value: 60, progressMax: 100, unit: '%' },
        { id: 'disk', icon: Server, label: 'Disk Space', value: 250, progressMax: 500, unit: 'GB' },
        { id: 'power', icon: Zap, label: 'Power Draw', value: "120W", unit: '' },
        { id: 'agents', icon: Users, label: 'Active Agents', value: 5, unit: '' },
      ],
    },
    defaultLayout: { x: 450, y: 20, width: 300, height: 260, zIndex: 3 }, // New card
    minWidth: 260, minHeight: 240, cardClassName: "flex-grow flex flex-col",
  },
  {
    id: 'microApps', title: 'Micro-Apps', icon: LayoutGrid, isDismissible: true,
    content: MicroAppsCardContent,
    contentProps: {
      availableApps: [
        { id: 'app-analytics', icon: BarChart2, label: 'Analytics' },
        { id: 'app-armory', icon: ArmoryIcon, label: 'Armory' },
        { id: 'app-loom', icon: LoomIcon, label: 'Loom' },
        { id: 'app-aegis', icon: AegisIcon, label: 'Aegis' },
      ]
    },
    defaultLayout: { x: 450, y: 290, width: 300, height: 150, zIndex: 4 }, // New card
    minWidth: 200, minHeight: 120,
  },
  {
    id: 'agentPresence', title: 'Agent Presence', icon: Users, isDismissible: true,
    content: AgentPresenceCardContent,
    contentProps: {
      agents: [
        { id: 'agent1', name: 'Data Harvester Alpha', description: 'Collecting market sentiment data for Q3 report.', status: 'Processing', statusColor: 'text-blue-500', statusIcon: LoaderCircle, time: '2m ago' },
        { id: 'agent2', name: 'Insight Engine Gamma', description: 'Idle, awaiting new data stream.', status: 'Idle', statusColor: 'text-green-500', statusIcon: Clock, time: '5m ago' },
        { id: 'agent3', name: 'Anomaly Detector Zeta', description: 'Security scan flagged an issue.', status: 'Error', statusColor: 'text-red-500', statusIcon: AlertTriangle, time: '10s ago' },
      ]
    },
    defaultLayout: { x: 20, y: 560, width: 730, height: 200, zIndex: 5 }, // New card, spans wider
    minWidth: 300, minHeight: 150,
  },
  {
    id: 'liveOrchestrationFeed', title: 'Live Orchestration Feed', icon: ListChecks, isDismissible: true,
    content: LiveOrchestrationFeedCardContent,
    contentProps: {
      feedItems: [
        { task: 'User Login Success', time: '10:35 AM', status: 'success', details: 'User john.doe logged in from IP 192.168.1.100' },
        { task: 'Automated Report Generation', time: '10:33 AM', status: 'success', details: 'Monthly sales report generated and emailed.' },
        { task: 'Data Sync Failure', time: '10:30 AM', status: 'failure', details: 'Failed to sync with CRM API. Retrying in 5 mins.' },
      ]
    },
    defaultLayout: { x: 450, y: 450, width: 300, height: 100, zIndex: 6 }, // New card (made it shorter)
    minWidth: 260, minHeight: 100,
  },
];

export const DEFAULT_ACTIVE_CARD_IDS = [
  'aiAssistant',
  'applicationView',
  'systemSnapshot',
  'microApps',
  'agentPresence',
  'liveOrchestrationFeed',
];
