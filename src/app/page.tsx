
"use client";
import React, { useState, useEffect, FormEvent } from 'react';
import { Rnd, type Position, type Size } from 'react-rnd';
import MicroAppCard from '@/components/micro-app-card';
import { Button } from '@/components/ui/button';
import { Sparkles, Cpu, AppWindow, Users, HardDrive, Timer, Blocks, Mic, MoreHorizontal, X, CheckCircle, AlertCircle, LoaderCircle, CircleDot, BarChartBig, Settings2, Shield, Server, Network, Clock, Info } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from '@/hooks/use-mobile';

import AiAssistantCardContent from '@/components/dashboard/ai-assistant-card-content';
import AgentPresenceCardContent, { type Agent } from '@/components/dashboard/agent-presence-card-content';
import SystemSnapshotCardContent, { type SystemMetric, type AgentTask } from '@/components/dashboard/system-snapshot-card-content';
import ApplicationViewCardContent from '@/components/dashboard/application-view-card-content';
import MicroAppsCardContent from '@/components/dashboard/micro-apps-card-content';
import LiveOrchestrationFeedCardContent, { type FeedItem } from '@/components/dashboard/live-orchestration-feed-card-content';
import type { GeneratePersonalizedBriefingInput } from '@/ai/flows/generate-personalized-briefings';
import { generatePersonalizedBriefing } from '@/ai/flows/generate-personalized-briefings';


const initialAgentsData: Agent[] = [
  { id: '1', name: 'NexusGuard_Alpha', description: 'Actively monitoring inbound/outbound netwo...', status: 'Idle', statusColor: 'text-yellow-400 dark:text-yellow-400', statusIcon: CircleDot, time: '2m ago' },
  { id: '2', name: 'Helios_Stream_Processor', description: 'Continuously analyzing high-volume sen...', status: 'Processing', statusColor: 'text-blue-400 dark:text-cyan-400', statusIcon: LoaderCircle, time: 'Now' },
  { id: '3', name: 'NovaSys_QueryEngine', description: 'Awaiting complex user queries and data retri...', status: 'Idle', statusColor: 'text-yellow-400 dark:text-yellow-400', statusIcon: CircleDot, time: '10s ago' },
  { id: '4', name: 'Cygnus_BackupAgent', description: 'Scheduled integrity check failed on target...', status: 'Error', statusColor: 'text-red-500 dark:text-red-500', statusIcon: AlertCircle, time: '5m ago' },
];

const initialFeedItems: FeedItem[] = [
  { task: 'Agent Task: Analyze User Sentiment', time: '0 seconds ago', status: 'failure', details: 'Analysis failed due to invalid input schema.' },
  { task: 'Agent Task: Deploy Microservice v1.2', time: '3 minutes ago', status: 'success', details: 'Deployment to staging successful.' },
  { task: 'Agent Task: Backup Database Cluster', time: '15 minutes ago', status: 'success', details: 'Full backup completed.' },
];

const systemMetricsConfigData: SystemMetric[] = [
  { id: 'agents', icon: Users, label: 'Active Agents', value: 5, unit: '' },
  { id: 'disk', icon: HardDrive, label: 'Disk Usage', value: 450, progressMax: 1000, unit: 'GB' },
  { id: 'networkSent', icon: Network, label: 'Network Sent', value: '1.2 GB', unit: '' },
  { id: 'networkReceived', icon: Network, label: 'Network Received', value: '8.5 GB', unit: '' },
  { id: 'uptime', icon: Clock, label: 'System Uptime', value: '12d 4h 32m', unit: '' },
];

const agentTaskExampleData: AgentTask | undefined = undefined; 

interface CardLayoutInfo {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
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
  const isMobile = useIsMobile();

  const [dismissedCardIds, setDismissedCardIds] = useState<string[]>([]);

  const handleDismissCardAttempt = (id: string) => {
    setDismissedCardIds(prevIds => [...prevIds, id]);
  };

  const CardActions = (cardId: string, onDismiss: (id: string) => void, isDismissible?: boolean) => (
    <TooltipProvider delayDuration={0}>
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
        operationalMetrics: "System metrics: Active Agents (5), Disk Usage (450GB/1000GB), Network Sent (1.2GB), Network Received (8.5GB), System Uptime (12d 4h 32m).",
        relevantInformation: `User asked: "${aiPrompt}". Provide a concise, helpful response.`,
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

  const initialCardsData: CardConfig[] = [
    { 
      id: 'aiAssistant', title: 'AI Assistant', icon: Sparkles, isDismissible: true,
      x: 20, y: 20, width: 580, height: 300, zIndex: 1, minWidth: 400, minHeight: 280,
      cardClassName: "flex-grow flex flex-col",
      content: AiAssistantCardContent,
      contentProps: {
        aiPrompt,
        setAiPrompt,
        handleAiSubmit,
        isAiLoading,
        aiResponse,
        placeholderInsight: "Analyze product sales, compare revenue, or ask for insights."
      }
    },
    { 
      id: 'agentPresence', title: 'Agent Presence', icon: Cpu, isDismissible: true,
      x: 620, y: 20, width: 450, height: 230, zIndex: 1, minWidth: 300, minHeight: 200,
      content: AgentPresenceCardContent,
      contentProps: { agents: initialAgentsData }
    },
    { 
      id: 'systemSnapshot', title: 'System Snapshot', icon: Server, isDismissible: true,
      x: 620, y: 270, width: 450, height: 250, zIndex: 1, minWidth: 320, minHeight: 240,
      content: SystemSnapshotCardContent,
      contentProps: { systemMetricsConfig: systemMetricsConfigData, agentTask: agentTaskExampleData }
    },
     { 
      id: 'microApps', title: 'Micro-Apps', icon: Blocks, isDismissible: true,
      x: 620, y: 540, width: 450, height: 130, zIndex: 1, minWidth: 280, minHeight: 120, 
      content: MicroAppsCardContent,
    },
    { 
      id: 'applicationView', title: 'Application View', icon: AppWindow, isDismissible: true,
      x: 20, y: 340, width: 580, height: 330, zIndex: 1, minWidth: 400, minHeight: 200,
      content: ApplicationViewCardContent,
    },
    { 
      id: 'liveOrchestration', title: 'Live Orchestration Feed', icon: CheckCircle, isDismissible: true,
      x: 1090, y: 20, width: 400, height: 650, zIndex: 1, minWidth: 320, minHeight: 250, 
      cardClassName: "flex-grow flex flex-col",
      content: LiveOrchestrationFeedCardContent,
      contentProps: { feedItems: initialFeedItems }
    },
  ];

  initialCardsData.forEach(card => {
    card.actions = (cardId, onDismiss) => CardActions(cardId, onDismiss, card.isDismissible);
  });


  const [cardLayouts, setCardLayouts] = useState<CardLayoutInfo[]>(
    initialCardsData.map(({ id, x, y, width, height, zIndex }) => ({ id, x, y, width, height, zIndex }))
  );

  const getMaxZIndex = () => {
    if (cardLayouts.length === 0) return 0;
    return Math.max(...cardLayouts.map(card => card.zIndex).filter(z => typeof z === 'number'));
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
    <div className="relative w-full min-h-[calc(100vh-4rem)] overflow-auto p-4">
      {isMobile ? (
        <div className="flex flex-col space-y-4">
          {cardsToRender.map(cardConfig => {
            const CardSpecificContent = cardConfig.content;
            return (
              <div key={cardConfig.id} className="w-full">
                <MicroAppCard
                  title={cardConfig.title}
                  icon={cardConfig.icon}
                  actions={cardConfig.actions ? cardConfig.actions(cardConfig.id, handleDismissCardAttempt) : undefined}
                  className={cn("!rounded-lg", cardConfig.cardClassName)}
                >
                  <CardSpecificContent {...cardConfig.contentProps} />
                </MicroAppCard>
              </div>
            );
          })}
        </div>
      ) : (
        // Desktop: RND-based layout
        cardsToRender.map(cardConfig => {
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
                "border-transparent hover:border-primary/30 focus-within:border-primary",
              )}
              dragGrid={[10, 10]}
              resizeGrid={[10, 10]}
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
        })
      )}
       <div className="fixed bottom-4 right-4 text-xs text-muted-foreground/70 font-code z-[9999]">
        <span>ΛΞVON OS v1.0 </span>
        <span className="font-semibold">SILENT AUTOMATION</span>
      </div>
    </div>
  );
}
    
