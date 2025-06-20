
import { lazy, type LazyExoticComponent, type FC, type ElementType } from 'react';

// Lazy loaded card content components
const BeepCardContent = lazy(() => import('@/components/dashboard/beep-card-content'));
const ApplicationViewCardContent = lazy(() => import('@/components/dashboard/application-view-card-content'));
const AgentPresenceCardContent = lazy(() => import('@/components/dashboard/agent-presence-card-content'));
const LiveOrchestrationFeedCardContent = lazy(() => import('@/components/dashboard/live-orchestration-feed-card-content'));
const MicroAppsCardContent = lazy(() => import('@/components/dashboard/micro-apps-card-content'));
const SystemSnapshotCardContent = lazy(() => import('@/components/dashboard/system-snapshot-card-content'));


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
  ZapIcon,
  ChartBarIcon,
  CreditCardIcon as ArmoryIcon,
  Settings2Icon as LoomIcon,
  ShieldCheckIcon as AegisIcon,
  ClockIcon,
  RefreshCwIcon as LoaderCircleIcon,
  AlertTriangleIcon,
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
    id: 'beep', title: 'BEEP (Behavioral Event & Execution Processor)', icon: MagicWandIcon, isDismissible: true,
    content: BeepCardContent,
    contentProps: {
      placeholderInsight: "Ask BEEP to analyze data, execute tasks, or provide operational intelligence."
    },
    defaultLayout: { x: 20, y: 20, width: 420, height: 260, zIndex: 1 },
    minWidth: 300, minHeight: 240, cardClassName: "flex-grow flex flex-col",
  },
  {
    id: 'applicationView', title: 'Active Micro-App', icon: AppWindowIcon, isDismissible: true,
    content: ApplicationViewCardContent,
    // Content props for ApplicationViewCardContent will be augmented in page.tsx to include setIsCommandPaletteOpen
    defaultLayout: { x: 20, y: 290, width: 420, height: 260, zIndex: 2 },
    minWidth: 300, minHeight: 180,
  },
  {
    id: 'systemSnapshot', title: 'System Snapshot', icon: BarChartBigIcon, isDismissible: true,
    content: SystemSnapshotCardContent,
    contentProps: {
      systemMetricsConfig: [
        { id: 'cpu', icon: CpuIcon, label: 'CPU Usage', value: 75, progressMax: 100, unit: '%' },
        { id: 'memory', icon: DatabaseZapIcon, label: 'Memory Usage', value: 60, progressMax: 100, unit: '%' },
        { id: 'disk', icon: HardDriveIcon, label: 'Disk Space', value: 250, progressMax: 500, unit: 'GB' },
        { id: 'power', icon: ZapIcon, label: 'Power Draw', value: "120W", unit: '' },
        { id: 'agents', icon: UsersIcon, label: 'Active Agents', value: 5, unit: '' },
      ],
    },
    defaultLayout: { x: 450, y: 20, width: 300, height: 260, zIndex: 3 },
    minWidth: 260, minHeight: 240, cardClassName: "flex-grow flex flex-col",
  },
  {
    id: 'microApps', title: 'Micro-Apps', icon: LayoutGridIcon, isDismissible: true,
    content: MicroAppsCardContent,
    contentProps: {
      availableApps: [
        { id: 'app-analytics', icon: ChartBarIcon, label: 'Analytics' },
        { id: 'app-armory', icon: ArmoryIcon, label: 'Armory' },
        { id: 'app-loom', icon: LoomIcon, label: 'Loom' },
        { id: 'app-aegis', icon: AegisIcon, label: 'Aegis' },
      ]
    },
    defaultLayout: { x: 450, y: 290, width: 300, height: 150, zIndex: 4 },
    minWidth: 200, minHeight: 120,
  },
  {
    id: 'agentPresence', title: 'Agent Presence', icon: UsersIcon, isDismissible: true,
    content: AgentPresenceCardContent,
    contentProps: {
      agents: [
        { id: 'agent1', name: 'Data Harvester Alpha', description: 'Collecting market sentiment data for Q3 report.', status: 'Processing', statusColor: 'text-blue-500', statusIcon: LoaderCircleIcon, time: '2m ago' },
        { id: 'agent2', name: 'Insight Engine Gamma', description: 'Idle, awaiting new data stream.', status: 'Idle', statusColor: 'text-green-500', statusIcon: ClockIcon, time: '5m ago' },
        { id: 'agent3', name: 'Anomaly Detector Zeta', description: 'Security scan flagged an issue.', status: 'Error', statusColor: 'text-red-500', statusIcon: AlertTriangleIcon, time: '10s ago' },
      ]
    },
    defaultLayout: { x: 20, y: 560, width: 730, height: 200, zIndex: 5 },
    minWidth: 300, minHeight: 150,
  },
  {
    id: 'liveOrchestrationFeed', title: 'Live Orchestration Feed', icon: ListChecksIcon, isDismissible: true,
    content: LiveOrchestrationFeedCardContent,
    contentProps: {
      feedItems: [
        { task: 'User Login Success', time: '10:35 AM', status: 'success', details: 'User john.doe logged in from IP 192.168.1.100' },
        { task: 'Automated Report Generation', time: '10:33 AM', status: 'success', details: 'Monthly sales report generated and emailed.' },
        { task: 'Data Sync Failure', time: '10:30 AM', status: 'failure', details: 'Failed to sync with CRM API. Retrying in 5 mins.' },
      ]
    },
    defaultLayout: { x: 450, y: 450, width: 300, height: 100, zIndex: 6 },
    minWidth: 260, minHeight: 100,
  },
];

export const DEFAULT_ACTIVE_CARD_IDS = [
  'beep',
  'applicationView',
  'systemSnapshot',
  'microApps',
  'agentPresence',
  'liveOrchestrationFeed',
];
