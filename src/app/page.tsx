
"use client";
import React, { useState, useEffect, FormEvent, Suspense, useCallback, lazy } from 'react';
import { Rnd, type Position, type Size } from 'react-rnd';
import MicroAppCard from '@/components/micro-app-card';
import { Button } from '@/components/ui/button';
import { Sparkles, Cpu, AppWindow, Users, HardDrive, Timer, Blocks, Mic, MoreHorizontal, X, CheckCircle, AlertCircle, LoaderCircle, CircleDot, BarChartBig, Settings2, Shield, Server, Network, Clock, Info, LayoutDashboard, Palette } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from '@/hooks/use-mobile';
import type { GeneratePersonalizedBriefingInput } from '@/ai/flows/generate-personalized-briefings';
import { generatePersonalizedBriefing } from '@/ai/flows/generate-personalized-briefings';
import eventBus from '@/lib/event-bus';
import CommandPalette from '@/components/command-palette';

// Async load card content components
const AiAssistantCardContent = lazy(() => import('@/components/dashboard/ai-assistant-card-content'));
const AgentPresenceCardContent = lazy(() => import('@/components/dashboard/agent-presence-card-content'));
const SystemSnapshotCardContent = lazy(() => import('@/components/dashboard/system-snapshot-card-content'));
const ApplicationViewCardContent = lazy(() => import('@/components/dashboard/application-view-card-content'));
const MicroAppsCardContent = lazy(() => import('@/components/dashboard/micro-apps-card-content'));
const LiveOrchestrationFeedCardContent = lazy(() => import('@/components/dashboard/live-orchestration-feed-card-content'));

// Data (can be moved to a separate file)
const initialAgentsData: AgentPresenceAgent[] = [
  { id: '1', name: 'NexusGuard_Alpha', description: 'Actively monitoring inbound/outbound netwo...', status: 'Idle', statusColor: 'text-yellow-400 dark:text-yellow-400', statusIcon: CircleDot, time: '2m ago' },
  { id: '2', name: 'Helios_Stream_Processor', description: 'Continuously analyzing high-volume sen...', status: 'Processing', statusColor: 'text-blue-400 dark:text-cyan-400', statusIcon: LoaderCircle, time: 'Now' },
  { id: '3', name: 'NovaSys_QueryEngine', description: 'Awaiting complex user queries and data retri...', status: 'Idle', statusColor: 'text-yellow-400 dark:text-yellow-400', statusIcon: CircleDot, time: '10s ago' },
  { id: '4', name: 'Cygnus_BackupAgent', description: 'Scheduled integrity check failed on target...', status: 'Error', statusColor: 'text-red-500 dark:text-red-500', statusIcon: AlertCircle, time: '5m ago' },
];
type AgentPresenceAgent = import('@/components/dashboard/agent-presence-card-content').Agent;


const initialFeedItems: LiveFeedItem[] = [
  { task: 'Agent Task: Analyze User Sentiment', time: '0 seconds ago', status: 'failure', details: 'Analysis failed due to invalid input schema.' },
  { task: 'Agent Task: Deploy Microservice v1.2', time: '3 minutes ago', status: 'success', details: 'Deployment to staging successful.' },
  { task: 'Agent Task: Backup Database Cluster', time: '15 minutes ago', status: 'success', details: 'Full backup completed.' },
];
type LiveFeedItem = import('@/components/dashboard/live-orchestration-feed-card-content').FeedItem;

const systemMetricsConfigData: SystemMetricConfig[] = [
  { id: 'agents', icon: Users, label: 'Active Agents', value: 5, unit: '' },
  { id: 'disk', icon: HardDrive, label: 'Disk Usage', value: 450, progressMax: 1000, unit: 'GB' },
  { id: 'networkSent', icon: Network, label: 'Network Sent', value: '1.2 GB', unit: '' },
  { id: 'networkReceived', icon: Network, label: 'Network Received', value: '8.5 GB', unit: '' },
  { id: 'uptime', icon: Clock, label: 'System Uptime', value: '12d 4h 32m', unit: '' },
];
type SystemMetricConfig = import('@/components/dashboard/system-snapshot-card-content').SystemMetric;


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
  icon: React.ElementType;
  content: React.LazyExoticComponent<React.FC<any>>;
  contentProps?: any;
  defaultLayout: { x: number; y: number; width: number; height: number; zIndex: number };
  minWidth: number;
  minHeight: number;
  isDismissible?: boolean;
  cardClassName?: string;
}


const ALL_CARD_CONFIGS: CardConfig[] = [
  {
    id: 'aiAssistant', title: 'AI Assistant', icon: Sparkles, isDismissible: true,
    content: AiAssistantCardContent,
    contentProps: {
      placeholderInsight: "Analyze product sales, compare revenue, or ask for insights."
    },
    defaultLayout: { x: 20, y: 20, width: 580, height: 300, zIndex: 1 },
    minWidth: 400, minHeight: 280, cardClassName: "flex-grow flex flex-col",
  },
  {
    id: 'agentPresence', title: 'Agent Presence', icon: Cpu, isDismissible: true,
    content: AgentPresenceCardContent,
    contentProps: { agents: initialAgentsData },
    defaultLayout: { x: 620, y: 20, width: 450, height: 230, zIndex: 1 },
    minWidth: 300, minHeight: 200,
  },
  {
    id: 'systemSnapshot', title: 'System Snapshot', icon: Server, isDismissible: true,
    content: SystemSnapshotCardContent,
    contentProps: { systemMetricsConfig: systemMetricsConfigData, agentTask: undefined },
    defaultLayout: { x: 620, y: 270, width: 450, height: 250, zIndex: 1 },
    minWidth: 320, minHeight: 240,
  },
  {
    id: 'microApps', title: 'Micro-Apps', icon: Blocks, isDismissible: true,
    content: MicroAppsCardContent,
    defaultLayout: { x: 620, y: 540, width: 450, height: 130, zIndex: 1 },
    minWidth: 280, minHeight: 120,
  },
  {
    id: 'applicationView', title: 'Application View', icon: AppWindow, isDismissible: true,
    content: ApplicationViewCardContent,
    defaultLayout: { x: 20, y: 340, width: 580, height: 330, zIndex: 1 },
    minWidth: 400, minHeight: 200,
  },
  {
    id: 'liveOrchestration', title: 'Live Orchestration Feed', icon: CheckCircle, isDismissible: true,
    content: LiveOrchestrationFeedCardContent,
    contentProps: { feedItems: initialFeedItems },
    defaultLayout: { x: 1090, y: 20, width: 400, height: 650, zIndex: 1 },
    minWidth: 320, minHeight: 250, cardClassName: "flex-grow flex flex-col",
  },
];

const DEFAULT_ACTIVE_CARD_IDS = ['aiAssistant', 'agentPresence', 'systemSnapshot', 'applicationView', 'liveOrchestration'];


export default function DashboardPage() {
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const [activeCardIds, setActiveCardIds] = useState<string[]>(DEFAULT_ACTIVE_CARD_IDS);
  const [cardLayouts, setCardLayouts] = useState<CardLayoutInfo[]>([]);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Load layout and active cards from localStorage
  useEffect(() => {
    const savedLayouts = localStorage.getItem('dashboardCardLayouts_v1');
    const savedActiveIds = localStorage.getItem('dashboardActiveCardIds_v1');

    let currentActiveIds = DEFAULT_ACTIVE_CARD_IDS;
    if (savedActiveIds) {
      try {
        currentActiveIds = JSON.parse(savedActiveIds);
      } catch (e) {
        console.error("Failed to parse active card IDs from localStorage", e);
      }
    }
    setActiveCardIds(currentActiveIds);

    if (savedLayouts) {
      try {
        setCardLayouts(JSON.parse(savedLayouts));
      } catch (e) {
        console.error("Failed to parse layouts from localStorage", e);
        setCardLayouts(ALL_CARD_CONFIGS.map(c => ({ ...c.defaultLayout, id: c.id })));
      }
    } else {
      setCardLayouts(ALL_CARD_CONFIGS.map(c => ({ ...c.defaultLayout, id: c.id })));
    }
  }, []);

  // Save layout and active cards to localStorage
  useEffect(() => {
    if (cardLayouts.length > 0) { // Only save if layouts have been initialized
      localStorage.setItem('dashboardCardLayouts_v1', JSON.stringify(cardLayouts));
    }
  }, [cardLayouts]);

  useEffect(() => {
     localStorage.setItem('dashboardActiveCardIds_v1', JSON.stringify(activeCardIds));
  }, [activeCardIds]);


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

  const getMaxZIndex = useCallback(() => {
    if (cardLayouts.length === 0) return 0;
    return Math.max(0, ...cardLayouts.map(card => card.zIndex).filter(z => typeof z === 'number'));
  }, [cardLayouts]);

  const updateCardLayout = useCallback((id: string, newPos: Position, newSize?: Size) => {
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
  }, [getMaxZIndex]);

  const handleBringToFront = useCallback((id: string) => {
    setCardLayouts(prevLayouts =>
      prevLayouts.map(layout =>
        layout.id === id
          ? { ...layout, zIndex: getMaxZIndex() + 1 }
          : layout
      )
    );
  }, [getMaxZIndex]);

  const handleRemoveCard = useCallback((cardId: string) => {
    setActiveCardIds(prev => prev.filter(id => id !== cardId));
    toast({ title: "Zone Removed", description: `The zone has been removed from your dashboard.`});
  }, []);
  
  const handleAddCard = useCallback((cardId: string) => {
    if (!activeCardIds.includes(cardId)) {
      setActiveCardIds(prev => [...prev, cardId]);
      // Add to layouts if not already there, or use default
      if (!cardLayouts.find(l => l.id === cardId)) {
        const defaultConfig = ALL_CARD_CONFIGS.find(c => c.id === cardId);
        if (defaultConfig) {
          setCardLayouts(prev => [...prev, { ...defaultConfig.defaultLayout, id: cardId, zIndex: getMaxZIndex() + 1 }]);
        }
      }
      toast({ title: "Zone Added", description: `The zone has been added to your dashboard.`});
    }
  }, [activeCardIds, cardLayouts, getMaxZIndex]);

  const handleResetLayout = useCallback(() => {
    setActiveCardIds(DEFAULT_ACTIVE_CARD_IDS);
    setCardLayouts(ALL_CARD_CONFIGS.map(c => ({ ...c.defaultLayout, id: c.id })));
    toast({ title: "Layout Reset", description: "Dashboard layout has been reset to default."});
  }, []);


  const CardActions = (cardId: string, isDismissible?: boolean) => (
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
              <Button variant="ghost" size="icon" className="w-6 h-6 text-muted-foreground hover:text-destructive" onClick={() => handleRemoveCard(cardId)}>
                <X className="w-4 h-4"/>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom"><p>Remove Zone</p></TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
  
  const cardsToRender = ALL_CARD_CONFIGS.filter(card => activeCardIds.includes(card.id));

  const getMergedContentProps = (cardConfig: CardConfig) => {
    let specificProps = {};
    if (cardConfig.id === 'aiAssistant') {
      specificProps = {
        aiPrompt,
        setAiPrompt,
        handleAiSubmit,
        isAiLoading,
        aiResponse,
      };
    }
    return {
      ...cardConfig.contentProps,
      ...specificProps,
      eventBusInstance: eventBus, // Pass event bus to all cards
    };
  };


  const cardLoadingFallback = (
    <div className="p-4 h-full flex flex-col">
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-4" />
      <Skeleton className="flex-grow w-full" />
    </div>
  );

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
                  actions={CardActions(cardConfig.id, cardConfig.isDismissible)}
                  className={cn("!rounded-lg", cardConfig.cardClassName)}
                >
                  <Suspense fallback={cardLoadingFallback}>
                    <CardSpecificContent {...getMergedContentProps(cardConfig)} />
                  </Suspense>
                </MicroAppCard>
              </div>
            );
          })}
        </div>
      ) : (
        cardsToRender.map(cardConfig => {
          const currentLayout = cardLayouts.find(l => l.id === cardConfig.id);
          if (!currentLayout) {
             // Attempt to find a default if somehow missing, though this should be rare
             const defaultConf = ALL_CARD_CONFIGS.find(c => c.id === cardConfig.id);
             if (defaultConf) {
                // Add it to layouts with a new z-index, this could happen if a card was added and layout wasn't immediately set
                const newLayout = { ...defaultConf.defaultLayout, id: cardConfig.id, zIndex: getMaxZIndex() + 1 };
                // Avoid direct state update in render, but log or handle. For now, skip rendering if no layout.
                console.warn(`Layout not found for card ${cardConfig.id}, consider adding default.`);
                return null; 
             }
             return null;
          }


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
                actions={CardActions(cardConfig.id, cardConfig.isDismissible)}
                className={cn("h-full w-full !rounded-lg", cardConfig.cardClassName)}
              >
                 <Suspense fallback={cardLoadingFallback}>
                    <CardSpecificContent {...getMergedContentProps(cardConfig)} />
                 </Suspense>
              </MicroAppCard>
            </Rnd>
          );
        })
      )}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onOpenChange={setIsCommandPaletteOpen}
        allPossibleCards={ALL_CARD_CONFIGS}
        activeCardIds={activeCardIds}
        cardLayouts={cardLayouts}
        onAddCard={handleAddCard}
        onRemoveCard={handleRemoveCard}
        onResetLayout={handleResetLayout}
      />
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 left-4 z-50 rounded-full shadow-xl bg-background/80 backdrop-blur-sm hover:bg-primary/20"
        onClick={() => setIsCommandPaletteOpen(true)}
      >
        <LayoutDashboard className="h-5 w-5 text-primary" />
        <span className="sr-only">Manage Dashboard Zones</span>
      </Button>
       <div className="fixed bottom-4 right-4 text-xs text-muted-foreground/70 font-code z-[9999]">
        <span>ΛΞVON OS v1.1 </span>
        <span className="font-semibold">DYNAMIC GRID</span>
      </div>
    </div>
  );
}
