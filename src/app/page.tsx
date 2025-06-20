
"use client";
import React, { useState, useEffect, FormEvent } from 'react';
import Image from 'next/image';
import { Rnd, type Position, type Size } from 'react-rnd';
import MicroAppCard from '@/components/micro-app-card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Blocks, Cpu, LayoutGrid, Users, HardDrive, ArrowUpFromLine, ArrowDownToLine, Timer, AppWindow, LoaderCircle, CircleDot, AlertCircle, XCircle, CheckCircle, MoreHorizontal, Mic, Minus, BarChartBig, Settings2, Shield as ShieldIcon, GitFork } from 'lucide-react';
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

interface OrchestrationTask {
  id: string;
  title: string;
  time: string;
  status: 'success' | 'failure';
  details?: string;
}

const initialAgentsData: Agent[] = [
  { id: '1', name: 'OrionCore_7B', description: 'Optimizing dynamic resource allocation...', status: 'Processing', statusColor: 'text-accent', statusIcon: LoaderCircle, time: 'Now' },
  { id: '2', name: 'NexusGuard_Alpha', description: 'Actively monitoring inbound/outbound netwo...', status: 'Idle', statusColor: 'text-secondary', statusIcon: CircleDot, time: '2m ago' },
  { id: '3', name: 'Helios_Stream_Processor', description: 'Continuously analyzing high-volume sen...', status: 'Processing', statusColor: 'text-accent', statusIcon: LoaderCircle, time: 'Now' },
  { id: '4', name: 'NovaSys_QueryEngine', description: 'Awaiting complex user queries and data retri...', status: 'Idle', statusColor: 'text-secondary', statusIcon: CircleDot, time: '10s ago' },
  { id: '5', name: 'Cygnus_BackupAgent', description: 'Scheduled integrity check failed on target ...', status: 'Error', statusColor: 'text-destructive', statusIcon: AlertCircle, time: '5m ago' },
];

const initialTasksData: OrchestrationTask[] = [
  { id: '1', title: 'Agent Task: Analyze User Sentiment', time: '0 seconds ago', status: 'failure', details: 'Sentiment analysis model returned low confidence score due to ambiguous input language.' },
  { id: '2', title: 'Agent Task: Deploy Microservice v1.2', time: '3 minutes ago', status: 'success', details: 'Deployment to staging environment successful. Health checks passing.' },
  { id: '3', title: 'Agent Task: Backup Database Cluster', time: '15 minutes ago', status: 'success', details: 'Full backup of primary and replica databases completed without errors.' },
];

const CardActions = () => (
  <div className="flex items-center space-x-1">
    <Button variant="ghost" size="icon" className="w-6 h-6 text-muted-foreground hover:text-primary"> <Mic className="w-3 h-3"/> </Button>
    <Button variant="ghost" size="icon" className="w-6 h-6 text-muted-foreground hover:text-primary"> <MoreHorizontal className="w-3 h-3"/> </Button>
    <Button variant="ghost" size="icon" className="w-6 h-6 text-muted-foreground hover:text-primary"> <Minus className="w-3 h-3"/> </Button>
  </div>
);

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
  actions?: React.ReactNode;
  cardClassName?: string;
  content: (props?: any) => React.ReactNode;
  minWidth: number;
  minHeight: number;
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
  const [activeAgentsCount, setActiveAgentsCount] = useState(5);

  const [agents, setAgents] = useState<Agent[]>(initialAgentsData);
  const [tasks, setTasks] = useState<OrchestrationTask[]>(initialTasksData);


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
      setNetworkSent(prev => parseFloat((prev + Math.random() * 0.1).toFixed(1)));
      setNetworkReceived(prev => parseFloat((prev + Math.random() * 0.5).toFixed(1)));
      setActiveAgentsCount(initialAgentsData.filter(agent => agent.status === 'Processing' || agent.status === 'Idle').length);

    }, 2000); // Update a bit less frequently for performance
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
    { id: 'sent', icon: ArrowUpFromLine, label: 'Network Sent', value: networkSent, unit: 'GB' },
    { id: 'received', icon: ArrowDownToLine, label: 'Network Received', value: networkReceived, unit: 'GB' },
    { id: 'uptime', icon: Timer, label: 'System Uptime', value: systemUptime, unit: '' },
  ];

  const microAppLaunchersConfig = [
    { id: 'app1', icon: BarChartBig, label: 'Launch Analytics' },
    { id: 'app2', icon: Settings2, label: 'Launch Configurator' },
    { id: 'app3', icon: ShieldIcon, label: 'Launch Security' },
  ];

  const initialCards: CardConfig[] = [
    {
      id: 'aiAssistant', title: 'AI Assistant', icon: Sparkles, actions: <CardActions/>,
      x: 20, y: 20, width: 400, height: 520, zIndex: 1, minWidth: 320, minHeight: 400,
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
      id: 'appView', title: 'Application View', icon: AppWindow, actions: <CardActions/>,
      x: 20, y: 560, width: 400, height: 230, zIndex: 1, minWidth: 250, minHeight: 180,
      content: () => (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <Blocks className="w-16 h-16 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">No micro-app launched.</p>
            <p className="text-xs text-muted-foreground/80">Select an app from the 'Micro-Apps' launcher.</p>
          </div>
      )
    },
    {
      id: 'systemSnapshot', title: 'System Snapshot', icon: LayoutGrid, actions: <CardActions/>,
      x: 440, y: 20, width: 380, height: 420, zIndex: 1, minWidth: 300, minHeight: 350,
      content: () => (
        <ul className="space-y-3 p-1">
          {systemMetricsConfig.map(metric => (
            <li key={metric.id} className="text-sm">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center text-muted-foreground">
                  <metric.icon className="w-4 h-4 mr-2 text-primary" />
                  <span>{metric.label}</span>
                </div>
                <span className="font-medium text-foreground">
                  {metric.progressMax ? `${metric.value}${metric.unit.startsWith('%') ? '%' : ''}` : metric.value}
                  {!metric.progressMax && metric.unit && !metric.unit.startsWith('%') && ` ${metric.unit}`}
                  {metric.progressMax && metric.unit.includes('/') && !metric.unit.startsWith('%') && ` ${metric.unit.substring(metric.unit.indexOf('/'))}`}
                </span>
              </div>
              {metric.progressMax && (
                <>
                  <Progress value={(metric.value / metric.progressMax) * 100} className="h-2 [&>div]:bg-primary" />
                  {metric.unit.includes('/') && !metric.unit.startsWith('%') && (
                    <span className="text-xs text-muted-foreground/70 float-right mt-0.5">
                      {metric.value}{metric.unit.substring(0, metric.unit.indexOf('/'))} of {metric.unit.substring(metric.unit.indexOf('/') + 1)}
                    </span>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )
    },
    {
      id: 'microApps', title: 'Micro-Apps', icon: Blocks, actions: <CardActions/>,
      x: 440, y: 460, width: 380, height: 180, zIndex: 1, minWidth: 300, minHeight: 150,
      content: () => (
        <div className="flex space-x-3 p-4 justify-around items-center h-full">
          {microAppLaunchersConfig.map(app => (
            <Button key={app.id} variant="outline" className="flex flex-col items-center justify-center h-24 w-24 border-dashed border-primary/50 hover:border-primary hover:bg-primary/10 group">
              <app.icon className="w-8 h-8 mb-1.5 text-primary/70 group-hover:text-primary"/>
              <span className="text-xs text-center text-muted-foreground group-hover:text-primary">{app.label}</span>
            </Button>
          ))}
        </div>
      )
    },
    {
      id: 'agentPresence', title: 'Agent Presence', icon: Cpu, actions: <CardActions/>,
      x: 840, y: 20, width: 400, height: 350, zIndex: 1, minWidth: 300, minHeight: 250,
      content: () => (
        <ScrollArea className="h-full pr-1">
          <ul className="space-y-2 p-1">
            {agents.map(agent => (
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
      id: 'orchestrationFeed', title: 'Live Orchestration Feed', icon: GitFork, actions: <CardActions/>,
      x: 840, y: 390, width: 400, height: 350, zIndex: 1, minWidth: 300, minHeight: 250,
      cardClassName: "flex flex-col",
      content: () => (
        <>
        <ScrollArea className="flex-grow pr-1">
          <Accordion type="single" collapsible className="w-full p-1">
            {tasks.map(task => (
              <AccordionItem value={task.id} key={task.id} className="border-b-0 mb-1">
                 <AccordionTrigger className="p-2.5 rounded-md bg-background/50 dark:bg-card hover:bg-muted/30 transition-colors hover:no-underline text-sm flex justify-between items-center w-full">
                  <div className="flex items-center text-left">
                     {task.status === 'success' ? <CheckCircle className="w-4 h-4 mr-2 text-secondary shrink-0"/> : <XCircle className="w-4 h-4 mr-2 text-destructive shrink-0"/>}
                    <div className="overflow-hidden">
                      <span className="font-medium text-foreground truncate block">{task.title}</span>
                      <p className="text-xs text-muted-foreground">{task.time}</p>
                    </div>
                  </div>
                   <span 
                    className={cn('capitalize text-xs px-2 py-0.5 rounded-sm font-medium ml-2 shrink-0', 
                        task.status === 'success' ? 'bg-secondary text-primary-foreground' : 'bg-destructive text-destructive-foreground'
                    )}>
                    {task.status}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground p-3 mt-0.5 mb-1 bg-muted/10 dark:bg-muted/20 rounded-b-md">
                  {task.details || "No further details available."}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          </ScrollArea>
          <div className="p-2 text-right text-xs text-muted-foreground/70 border-t border-border/30 dark:border-border/50 mt-auto shrink-0">
            ΛΞVON OS v1.0 <span className="font-semibold">SILENT AUTOMATION</span>
          </div>
        </>
      )
    },
  ];

  const [cardLayouts, setCardLayouts] = useState<CardLayoutInfo[]>(
    initialCards.map(({ id, x, y, width, height, zIndex }) => ({ id, x, y, width, height, zIndex }))
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


  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] overflow-hidden"> {/* Container for RND components */}
      {initialCards.map(cardConfig => {
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
            className="border border-transparent hover:border-primary/30 rounded-lg focus-within:border-primary" // Visual cue for active/hover
          >
            <MicroAppCard
              title={cardConfig.title}
              icon={cardConfig.icon}
              actions={cardConfig.actions}
              className={cn("h-full w-full !rounded-lg", cardConfig.cardClassName)} // Ensure card fills Rnd, override radius if RND adds one
            >
              <CardSpecificContent />
            </MicroAppCard>
          </Rnd>
        );
      })}
    </div>
  );
}
