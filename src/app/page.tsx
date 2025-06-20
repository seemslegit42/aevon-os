
"use client";
import React, { useState, useEffect, FormEvent } from 'react';
import Image from 'next/image';
import { Rnd, type Position, type Size } from 'react-rnd';
import MicroAppCard from '@/components/micro-app-card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Cpu, LayoutGrid, AppWindow, Users, HardDrive, Timer, LoaderCircle, CircleDot, AlertCircle, X, Blocks, Mic, MoreHorizontal, CheckCircle, ChevronDown, BarChartBig, Settings2, Shield } from 'lucide-react';
import { generatePersonalizedBriefing, GeneratePersonalizedBriefingInput } from '@/ai/flows/generate-personalized-briefings';
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Agent {
  id: string;
  name: string;
  description: string;
  status: 'Processing' | 'Idle' | 'Error';
  statusColor: string;
  statusIcon: React.ElementType;
  time: string;
}

const initialAgentsData: Agent[] = [
  { id: '1', name: 'OrionCore_7B', description: 'Optimizing dynamic resource allocation...', status: 'Processing', statusColor: 'text-accent', statusIcon: LoaderCircle, time: 'Now' },
  { id: '2', name: 'NexusGuard_Alpha', description: 'Actively monitoring inbound/outbound netwo...', status: 'Idle', statusColor: 'text-secondary', statusIcon: CircleDot, time: '2m ago' },
  { id: '3', name: 'Helios_Stream_Processor', description: 'Continuously analyzing high-volume sen...', status: 'Processing', statusColor: 'text-accent', statusIcon: LoaderCircle, time: 'Now' },
  { id: '4', name: 'NovaSys_QueryEngine', description: 'Awaiting complex user queries and data retri...', status: 'Idle', statusColor: 'text-secondary', statusIcon: CircleDot, time: '10s ago' },
  { id: '5', name: 'Cygnus_BackupAgent', description: 'Scheduled integrity check failed on target ...', status: 'Error', statusColor: 'text-destructive', statusIcon: AlertCircle, time: '5m ago' },
];

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
  content: (props?: any) => React.ReactNode;
  minWidth: number;
  minHeight: number;
  isDismissible?: boolean;
}

export default function HomePage() {
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
    <div className="flex items-center space-x-1">
      <Button variant="ghost" size="icon" className="w-6 h-6 text-muted-foreground hover:text-primary"> <Mic className="w-3 h-3"/> </Button>
      <Button variant="ghost" size="icon" className="w-6 h-6 text-muted-foreground hover:text-primary"> <MoreHorizontal className="w-3 h-3"/> </Button>
      {isDismissible && (
        <Button variant="ghost" size="icon" className="w-6 h-6 text-muted-foreground hover:text-destructive" onClick={() => onDismiss(cardId)}>
          <X className="w-4 h-4"/>
        </Button>
      )}
    </div>
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
      setDiskUsageValue(prev => Math.min(1000, Math.max(0, prev + Math.floor(Math.random() * 20) - 10)));
      setNetworkSent(parseFloat((Math.random() * 5).toFixed(1)));
      setNetworkReceived(parseFloat((Math.random() * 15).toFixed(1)));
    }, 2000);
    return () => clearInterval(interval);
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
        operationalMetrics: `CPU: ${cpuLoad}%, Memory: ${memoryUsage}%. System status normal. Key metrics are available in the System Snapshot.`,
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
  
  const systemMetricsConfig = [
    { id: 'cpu', icon: Cpu, label: 'CPU Load', value: cpuLoad, progressMax: 100, unit: '%' },
    { id: 'memory', icon: HardDrive, label: 'Memory Usage', value: memoryUsage, progressMax: 100, unit: '%' },
    { id: 'agents', icon: Users, label: 'Active Agents', value: activeAgentsCount, unit: '' }, 
    { id: 'disk', icon: HardDrive, label: 'Disk Usage', value: diskUsageValue, progressMax: 1000, unit: 'GB / 1TB' },
    { id: 'sent', icon: Cpu, label: 'Network Sent', value: networkSent, unit: 'GB' }, 
    { id: 'received', icon: HardDrive, label: 'Network Received', value: networkReceived, unit: 'GB' }, 
    { id: 'uptime', icon: Timer, label: 'System Uptime', value: systemUptime, unit: '' },
  ];

  const initialCardsData: CardConfig[] = [
    {
      id: 'aiAssistant', title: 'AI Assistant', icon: Sparkles, isDismissible: true,
      x: 50, y: 50, width: 400, height: 480, zIndex: 1, minWidth: 320, minHeight: 400,
      cardClassName: "flex-grow flex flex-col",
      content: () => (
        <>
          <div className="flex flex-col items-center justify-center text-center p-6 flex-grow">
            <Image src="https://placehold.co/120x120.png" alt="AI Assistant Orb" width={120} height={120} className="rounded-full mb-4" data-ai-hint="orb gradient" />
            <p className="text-sm text-muted-foreground mb-4">
              Analyze product sales, compare revenue, or ask for insights.
            </p>
            {aiResponse && <ScrollArea className="h-[100px] w-full"><p className="text-sm text-foreground bg-primary/10 dark:bg-primary/20 rounded-md p-3 mb-4 text-left whitespace-pre-wrap">{aiResponse}</p></ScrollArea>}
          </div>
          <form onSubmit={handleAiSubmit} className="p-4 border-t border-border/30 dark:border-border/50 mt-auto">
            <Textarea
              placeholder="Ask the AI assistant..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              rows={2}
              className="bg-background/70 dark:bg-input border-border/50 focus:ring-primary mb-2"
            />
            <button 
              type="submit" 
              className="w-full btn-gradient-primary-accent h-10 px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center" 
              disabled={isAiLoading}
            >
              {isAiLoading ? <LoaderCircle className="animate-spin mr-2 h-4 w-4"/> : null}
              Send Prompt
            </button>
          </form>
        </>
      )
    },
    {
      id: 'agentPresence', title: 'Agent Presence', icon: Cpu, isDismissible: true,
      x: 470, y: 50, width: 380, height: 230, zIndex: 1, minWidth: 300, minHeight: 200,
      content: () => (
        <ScrollArea className="h-full pr-1">
          <ul className="space-y-2 p-1">
            {agents.slice(0,5).map(agent => ( 
              <li key={agent.id} className="p-2.5 rounded-md bg-primary/5 dark:bg-black/20 hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-semibold text-foreground text-sm">{agent.name}</span>
                  <div className="flex items-center text-xs">
                    <agent.statusIcon className={`w-3.5 h-3.5 mr-1.5 ${agent.statusColor} ${agent.status === 'Processing' ? 'animate-spin' : ''}`} />
                    <span className={`${agent.statusColor}`}>{agent.status}</span>
                    <span className="text-muted-foreground ml-1">({agent.time})</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground truncate">{agent.description}</p>
              </li>
            ))}
          </ul>
        </ScrollArea>
      )
    },
    {
      id: 'systemSnapshot', title: 'System Snapshot', icon: LayoutGrid, isDismissible: true,
      x: 470, y: 300, width: 380, height: 320, zIndex: 1, minWidth: 300, minHeight: 300, 
      content: () => (
        <div className="space-y-3 p-1 flex flex-col h-full">
          <ul className="space-y-3">
            {systemMetricsConfig.map(metric => (
              <li key={metric.id} className="text-sm">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center text-muted-foreground">
                    <metric.icon className="w-4 h-4 mr-2 text-primary" />
                    <span>{metric.label}</span>
                  </div>
                  {metric.id === 'agents' ? (
                     <span className="bg-accent text-accent-foreground px-1.5 py-0.5 rounded-full text-xs font-medium">
                       {metric.value}
                     </span>
                  ) : (
                    <span className="font-medium text-foreground">
                    {metric.progressMax && metric.unit === '%' ? `${metric.value}%` : ''}
                    {metric.progressMax && metric.unit !== '%' && metric.unit.includes('/') ? `${metric.value}${metric.unit.substring(0, metric.unit.indexOf('/'))} / ${metric.progressMax}${metric.unit.substring(metric.unit.indexOf('/'))}` : ''}
                    {metric.progressMax && metric.unit !== '%' && !metric.unit.includes('/') && metric.unit.includes('GB') ? `${metric.value}GB / ${metric.progressMax}GB` : ''}
                    {!metric.progressMax && metric.unit !== '%' && metric.unit.includes('GB')? `${metric.value} ${metric.unit}` : ''}
                    {!metric.progressMax && metric.unit === '' ? metric.value : ''}
                    {metric.id === 'disk' ? `${metric.value}GB / ${metric.progressMax/1000}TB` : ''}
                  </span>
                  )}
                </div>
                {metric.progressMax ? (
                  <Progress 
                    value={metric.id === 'disk' ? (metric.value / metric.progressMax) * 100 : metric.value} 
                    className="h-2 [&>div]:bg-primary" 
                  />
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      )
    },
    {
      id: 'applicationView', title: 'Application View', icon: AppWindow, isDismissible: true,
      x: 50, y: 550, width: 400, height: 220, zIndex: 1, minWidth: 250, minHeight: 180,
      content: () => (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <Blocks className="w-16 h-16 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">No micro-app launched.</p>
            <p className="text-xs text-muted-foreground/80">Select an app from the 'Micro-Apps' launcher.</p>
          </div>
      )
    },
    {
      id: 'microApps', title: 'Micro-Apps', icon: Blocks, isDismissible: true,
      x: 470, y: 640, width: 380, height: 130, zIndex: 1, minWidth: 300, minHeight: 120,
      content: () => (
        <div className="grid grid-cols-3 gap-3 pt-1">
          {[
            {icon: BarChartBig, label: "Analytics"},
            {icon: Settings2, label: "Workflow"},
            {icon: Shield, label: "Security"},
          ].map((app, index) => (
            <Button key={index} variant="outline" className="flex flex-col items-center justify-center h-20 p-2 border-primary/20 hover:bg-primary/10">
              <app.icon className="w-7 h-7 text-primary mb-1" />
              <span className="text-xs text-primary truncate">Launch</span>
            </Button>
          ))}
        </div>
      )
    },
    {
      id: 'liveOrchestration', title: 'Live Orchestration Feed', icon: CheckCircle, isDismissible: true,
      x: 870, y: 50, width: 380, height: 720, zIndex: 1, minWidth: 320, minHeight: 300,
      cardClassName: "flex-grow flex flex-col",
      content: () => (
        <ScrollArea className="h-full pr-2">
          <ul className="space-y-3 p-1">
            {[
              { task: "Agent Task: Analyze User Sentiment", time: "0 seconds ago", status: "failure", details: "Model output flagged for review due to policy violation on harmful content." },
              { task: "Agent Task: Deploy Microservice v1.2", time: "3 minutes ago", status: "success", details: "Deployment to staging environment successful. Health checks passing." },
              { task: "Agent Task: Backup Database Cluster", time: "15 minutes ago", status: "success", details: "Full backup of 'production-db-cluster' completed and verified." },
              { task: "Agent Task: Scale Worker Pool", time: "22 minutes ago", status: "success", details: "Scaled worker pool 'data-ingestion' from 3 to 5 instances." },
              { task: "Agent Task: Train Sentiment Model", time: "1 hour ago", status: "failure", details: "Training failed. Insufficient data in 'new_feedback_batch'." },
            ].map((item, index) => (
              <li key={index} className="p-3 rounded-md bg-primary/5 dark:bg-black/20">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center">
                     {item.status === 'success' ? <CheckCircle className="w-5 h-5 mr-2 text-secondary shrink-0" /> : <X className="w-5 h-5 mr-2 text-destructive shrink-0" />}
                    <div>
                      <p className="font-semibold text-foreground text-sm">{item.task}</p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${item.status === 'success' ? 'bg-secondary text-primary-foreground' : 'bg-destructive text-destructive-foreground'}`}>
                    {item.status}
                  </span>
                </div>
                 <button className={`text-xs ${item.status === 'success' ? 'text-secondary' : 'text-destructive'} hover:underline flex items-center mt-1`}>
                  {item.status === 'success' ? 'Success Details' : 'Failure Details'} <ChevronDown className="w-3 h-3 ml-1" />
                </button>
              </li>
            ))}
          </ul>
        </ScrollArea>
      )
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
    <div className="relative w-full min-h-[calc(100vh-4rem)] overflow-hidden bg-background">
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
                top:false, right:true, bottom:true, left:false,
                topRight:false, bottomRight:true, bottomLeft:false, topLeft:false
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
              <CardSpecificContent />
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

    