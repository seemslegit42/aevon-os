
"use client";
import React, { useState, useEffect, FormEvent } from 'react';
import Image from 'next/image';
import { Rnd, type Position, type Size } from 'react-rnd';
import MicroAppCard from '@/components/micro-app-card';
import { Button } from '@/components/ui/button';
import { Sparkles, Cpu, LayoutGrid, AppWindow, Users, HardDrive, Timer, LoaderCircle, CircleDot, AlertCircle, X, Blocks, Mic, MoreHorizontal, CheckCircle, ChevronDown, BarChartBig, Settings2, Shield } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import AiAssistantCardContent from '@/components/dashboard/ai-assistant-card-content';
import AgentPresenceCardContent, { type Agent } from '@/components/dashboard/agent-presence-card-content';
import SystemSnapshotCardContent, { type SystemMetric, type AgentTask } from '@/components/dashboard/system-snapshot-card-content';
import ApplicationViewCardContent from '@/components/dashboard/application-view-card-content';
import MicroAppsCardContent from '@/components/dashboard/micro-apps-card-content';
import LiveOrchestrationFeedCardContent, { type FeedItem } from '@/components/dashboard/live-orchestration-feed-card-content';
import type { GeneratePersonalizedBriefingInput } from '@/ai/flows/generate-personalized-briefings';
import { generatePersonalizedBriefing } from '@/ai/flows/generate-personalized-briefings';


const initialAgentsData: Agent[] = [
  { id: '1', name: 'OrionCore_7B', description: 'Optimizing dynamic resource allocation...', status: 'Processing', statusColor: 'text-accent', statusIcon: LoaderCircle, time: 'Now' },
  { id: '2', name: 'NexusGuard_Alpha', description: 'Actively monitoring inbound/outbound netwo...', status: 'Idle', statusColor: 'text-secondary', statusIcon: CircleDot, time: '2m ago' },
  { id: '3', name: 'Helios_Stream_Processor', description: 'Continuously analyzing high-volume sen...', status: 'Processing', statusColor: 'text-accent', statusIcon: LoaderCircle, time: 'Now' },
  { id: '4', name: 'NovaSys_QueryEngine', description: 'Awaiting complex user queries and data retri...', status: 'Idle', statusColor: 'text-secondary', statusIcon: CircleDot, time: '10s ago' },
  { id: '5', name: 'Cygnus_BackupAgent', description: 'Scheduled integrity check failed on target ...', status: 'Error', statusColor: 'text-destructive', statusIcon: AlertCircle, time: '5m ago' },
];

const initialFeedItems: FeedItem[] = [
    { task: "Agent Task: Analyze User Sentiment", time: "0 seconds ago", status: "failure", details: "Model output flagged for review due to policy violation on harmful content." },
    { task: "Agent Task: Deploy Microservice v1.2", time: "3 minutes ago", status: "success", details: "Deployment to staging environment successful. Health checks passing." },
    { task: "Agent Task: Backup Database Cluster", time: "15 minutes ago", status: "success", details: "Full backup of 'production-db-cluster' completed and verified." },
];

const agentTaskData: AgentTask = {
  icon: CheckCircle,
  task: "Agent Task: Backup Database Cluster",
  time: "15 minutes ago",
  status: "success",
  statusText: "Success",
  detailsLinkText: "Success Details",
};


interface CardLayoutInfo {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isDismissing?: boolean;
}

interface CardConfig extends CardLayoutInfo {
  title: string;
  icon: React.ElementType;
  actions?: (cardId: string, onDismiss: (id: string) => void) => React.ReactNode;
  cardClassName?: string;
  content: React.FC<any>;
  contentProps?: any;
  minWidth: number;
  minHeight: number;
  isDismissible?: boolean;
}

export default function DashboardPage() {
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const { toast } = useToast();

  const [systemUptime, setSystemUptime] = useState("0d 0h 0m");
  const [cpuLoad, setCpuLoad] = useState(35);
  const [memoryUsage, setMemoryUsage] = useState(62);
  const [diskUsageValue, setDiskUsageValue] = useState(450);
  const [networkSent, setNetworkSent] = useState(1.2);
  const [networkReceived, setNetworkReceived] = useState(8.5);
  const [activeAgentsCount, setActiveAgentsCount] = useState(initialAgentsData.filter(agent => agent.status === 'Processing' || agent.status === 'Idle').length);


  const [agents, setAgents] = useState<Agent[]>(initialAgentsData);
  const [feedItems, setFeedItems] = useState<FeedItem[]>(initialFeedItems);
  const [dismissedCardIds, setDismissedCardIds] = useState<string[]>([]);

  const handleDismissCardAttempt = (id: string) => {
    setCardLayouts(prevLayouts =>
      prevLayouts.map(layout =>
        layout.id === id ? { ...layout, isDismissing: true, zIndex: getMaxZIndex() +1 } : layout
      )
    );
    setTimeout(() => {
      setDismissedCardIds(prevIds => [...prevIds, id]);
      setCardLayouts(prevLayouts => prevLayouts.filter(layout => layout.id !== id));
    }, 300);
  };

  const CardActions = (cardId: string, onDismiss: (id: string) => void, isDismissible?: boolean) => (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center space-x-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="w-6 h-6 text-muted-foreground hover:text-primary"> <Mic className="w-3 h-3"/> </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom"><p>Voice Command</p></TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="w-6 h-6 text-muted-foreground hover:text-primary"> <MoreHorizontal className="w-3 h-3"/> </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom"><p>More Options</p></TooltipContent>
        </Tooltip>
        {isDismissible && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="w-6 h-6 text-muted-foreground hover:text-destructive" onClick={() => onDismiss(cardId)}>
                <X className="w-4 h-4"/>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom"><p>Dismiss Card</p></TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );


  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const uptimeMillis = Date.now() - startTime;
      const d = Math.floor(uptimeMillis / (1000 * 60 * 60 * 24));
      const h = Math.floor((uptimeMillis % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((uptimeMillis % (1000 * 60 * 60)) / (1000 * 60));
      setSystemUptime(`${d}d ${h}h ${m}m`);

      setCpuLoad(Math.floor(Math.random() * (70 - 20 + 1)) + 20);
      setMemoryUsage(Math.floor(Math.random() * (80 - 40 + 1)) + 40);
      setDiskUsageValue(prev => Math.min(1000, Math.max(0, prev + Math.floor(Math.random() * 20) - 10))); // GB
      setNetworkSent(parseFloat((Math.random() * 5).toFixed(1))); // GB
      setNetworkReceived(parseFloat((Math.random() * 15).toFixed(1))); // GB
      // Simulate agent status changes for activeAgentsCount
      const updatedAgents = agents.map(agent => ({
        ...agent,
        status: Math.random() > 0.7 ? (agent.status === 'Error' ? 'Idle' : (Math.random() > 0.5 ? 'Processing' : 'Idle')) : agent.status,
      }));
      setAgents(updatedAgents); // This will trigger re-render of AgentPresenceCardContent if it depends on agents prop
      setActiveAgentsCount(updatedAgents.filter(agent => agent.status === 'Processing' || agent.status === 'Idle').length);

    }, 2000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleAiSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) {
      toast({ variant: "destructive", title: "Input Error", description: "Please enter a prompt for the AI assistant." });
      return;
    }
    setIsAiLoading(true);
    setAiResponse(null);
    try {
      const input: GeneratePersonalizedBriefingInput = {
        userName: "Dashboard User",
        operationalMetrics: `CPU: ${cpuLoad}%, Memory: ${memoryUsage}%. System status normal. Key metrics are available in the System Snapshot. Active agents: ${activeAgentsCount}. Disk: ${diskUsageValue}GB. Uptime: ${systemUptime}.`,
        relevantInformation: `User asked: "${aiPrompt}". Provide a concise, helpful response based on general knowledge or simulate an action if appropriate for a demo.`,
      };
      const result = await generatePersonalizedBriefing(input);
      setAiResponse(result.briefing);
    } catch (error) {
      console.error("Error with AI Assistant:", error);
      setAiResponse("Sorry, I encountered an error trying to respond. Please try again.");
      toast({ variant: "destructive", title: "AI Assistant Error", description: "Could not process your request." });
    } finally {
      setIsAiLoading(false);
    }
  };

  const systemMetricsConfig: SystemMetric[] = [
    { id: 'cpu', icon: Cpu, label: 'CPU Load', value: cpuLoad, progressMax: 100, unit: '%' },
    { id: 'memory', icon: HardDrive, label: 'Memory Usage', value: memoryUsage, progressMax: 100, unit: '%' },
    { id: 'agents', icon: Users, label: 'Active Agents', value: activeAgentsCount, unit: '' },
    { id: 'disk', icon: HardDrive, label: 'Disk Usage', value: diskUsageValue, progressMax: 1000, unit: 'GB' },
    { id: 'sent', icon: Cpu, label: 'Network Sent', value: networkSent, unit: 'GB' },
    { id: 'received', icon: HardDrive, label: 'Network Received', value: networkReceived, unit: 'GB' },
    { id: 'uptime', icon: Timer, label: 'System Uptime', value: systemUptime, unit: '' },
  ];

  const initialCardsData: CardConfig[] = [
    {
      id: 'aiAssistant', title: 'AI Assistant', icon: Sparkles, isDismissible: true,
      x: 50, y: 50, width: 400, height: 480, zIndex: 1, minWidth: 320, minHeight: 380,
      cardClassName: "flex-grow flex flex-col",
      content: AiAssistantCardContent,
      contentProps: {
        aiPrompt,
        setAiPrompt,
        handleAiSubmit,
        isAiLoading,
        aiResponse
      }
    },
    {
      id: 'agentPresence', title: 'Agent Presence', icon: Cpu, isDismissible: true,
      x: 470, y: 50, width: 380, height: 230, zIndex: 1, minWidth: 300, minHeight: 200,
      content: AgentPresenceCardContent,
      contentProps: { agents }
    },
    {
      id: 'systemSnapshot', title: 'System Snapshot', icon: LayoutGrid, isDismissible: true,
      x: 470, y: 300, width: 380, height: 380, zIndex: 1, minWidth: 300, minHeight: 350,
      content: SystemSnapshotCardContent,
      contentProps: { systemMetricsConfig, agentTask: agentTaskData }
    },
    {
      id: 'applicationView', title: 'Application View', icon: AppWindow, isDismissible: true,
      x: 50, y: 550, width: 400, height: 220, zIndex: 1, minWidth: 300, minHeight: 180,
      content: ApplicationViewCardContent,
    },
    {
      id: 'microApps', title: 'Micro-Apps', icon: Blocks, isDismissible: true,
      x: 870, y: 460, width: 380, height: 130, zIndex: 1, minWidth: 280, minHeight: 120,
      content: MicroAppsCardContent,
    },
    {
      id: 'liveOrchestration', title: 'Live Orchestration Feed', icon: CheckCircle, isDismissible: true,
      x: 870, y: 50, width: 380, height: 390, zIndex: 1, minWidth: 320, minHeight: 300,
      cardClassName: "flex-grow flex flex-col",
      content: LiveOrchestrationFeedCardContent,
      contentProps: { feedItems }
    },
  ];

  initialCardsData.forEach(card => {
    card.actions = (cardId, onDismiss) => CardActions(cardId, onDismiss, card.isDismissible);
  });


  const [cardLayouts, setCardLayouts] = useState<CardLayoutInfo[]>(
    initialCardsData.map(({ id, x, y, width, height, zIndex }) => ({ id, x, y, width, height, zIndex, isDismissing: false }))
  );

  const getMaxZIndex = () => {
    if (cardLayouts.length === 0) return 0;
    return Math.max(...cardLayouts.map(card => card.zIndex));
  };

  const updateCardLayout = (id: string, newPos: Position, newSize?: Size) => {
    setCardLayouts(prevLayouts =>
      prevLayouts.map(layout =>
        layout.id === id
          ? {
              ...layout,
              x: newPos.x,
              y: newPos.y,
              width: newSize ? parseInt(String(newSize.width)) : layout.width,
              height: newSize ? parseInt(String(newSize.height)) : layout.height,
              zIndex: getMaxZIndex() + 1,
            }
          : layout
      )
    );
  };

  const handleBringToFront = (id: string) => {
    setCardLayouts(prevLayouts =>
      prevLayouts.map(layout =>
        layout.id === id
          ? { ...layout, zIndex: getMaxZIndex() + 1 }
          : layout
      )
    );
  };

  const cardsToRender = initialCardsData.filter(card => !dismissedCardIds.includes(card.id));

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] overflow-hidden bg-transparent"> {/* Changed bg-background to bg-transparent so CanvasWrapper bg shows */}
      {cardsToRender.map(cardConfig => {
        const currentLayout = cardLayouts.find(l => l.id === cardConfig.id);
        if (!currentLayout) return null;

        const CardSpecificContent = cardConfig.content;

        return (
          <Rnd
            key={cardConfig.id}
            size={{ width: currentLayout.width, height: currentLayout.height }}
            position={{ x: currentLayout.x, y: currentLayout.y }}
            onDragStart={() => handleBringToFront(cardConfig.id)}
            onDragStop={(e, d) => {
              updateCardLayout(cardConfig.id, { x: d.x, y: d.y });
            }}
            onResizeStart={() => handleBringToFront(cardConfig.id)}
            onResizeStop={(e, direction, ref, delta, position) => {
              updateCardLayout(cardConfig.id, position, { width: ref.offsetWidth, height: ref.offsetHeight });
            }}
            minWidth={cardConfig.minWidth}
            minHeight={cardConfig.minHeight}
            bounds="parent"
            dragHandleClassName="drag-handle"
            enableResizing={{
                top:true, right:true, bottom:true, left:true,
                topRight:true, bottomRight:true, bottomLeft:true, topLeft:true
            }}
            style={{ zIndex: currentLayout.zIndex }}
            className={cn(
              "border border-transparent hover:border-primary/30 rounded-lg focus-within:border-primary",
              "card-enter-animation",
              currentLayout.isDismissing && "card-exit-animation"
            )}
            dragGrid={[20, 20]}
            resizeGrid={[20, 20]}
          >
            <MicroAppCard
              title={cardConfig.title}
              icon={cardConfig.icon}
              actions={cardConfig.actions ? cardConfig.actions(cardConfig.id, handleDismissCardAttempt) : undefined}
              className={cn("h-full w-full !rounded-lg", cardConfig.cardClassName)}
            >
              <CardSpecificContent {...cardConfig.contentProps} />
            </MicroAppCard>
          </Rnd>
        );
      })}
       <div className="fixed bottom-4 right-4 text-xs text-muted-foreground/70 font-code z-[9999]">
        <span>ΛΞVON OS v1.0 </span>
        <span className="font-semibold">SILENT AUTOMATION</span>
      </div>
    </div>
  );
}
