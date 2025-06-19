
"use client";
import React, { useState, useEffect, FormEvent } from 'react';
import Image from 'next/image';
import MicroAppCard from '@/components/micro-app-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Bot, Cpu, LayoutGrid, Users, HardDrive, ArrowUpFromLine, ArrowDownToLine, Timer, Rocket, GitFork, AppWindow, Send, LoaderCircle, CircleDot, AlertCircle, XCircle, CheckCircle, ArrowRightSquare, MoreHorizontal, Mic, Minus } from 'lucide-react';
import { generatePersonalizedBriefing, GeneratePersonalizedBriefingInput } from '@/ai/flows/generate-personalized-briefings';
import { useToast } from "@/hooks/use-toast";

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

const initialAgents: Agent[] = [
  { id: '1', name: 'OrionCore_7B', description: 'Optimizing dynamic resource allocation...', status: 'Processing', statusColor: 'text-blue-400', statusIcon: LoaderCircle, time: 'Now' },
  { id: '2', name: 'NexusGuard_Alpha', description: 'Actively monitoring inbound/outbound netwo...', status: 'Idle', statusColor: 'text-green-400', statusIcon: CircleDot, time: '2m ago' },
  { id: '3', name: 'Helios_Stream_Processor', description: 'Continuously analyzing high-volume sen...', status: 'Processing', statusColor: 'text-blue-400', statusIcon: LoaderCircle, time: 'Now' },
  { id: '4', name: 'NovaSys_QueryEngine', description: 'Awaiting complex user queries and data retri...', status: 'Idle', statusColor: 'text-green-400', statusIcon: CircleDot, time: '10s ago' },
  { id: '5', name: 'Cygnus_BackupAgent', description: 'Scheduled integrity check failed on target ...', status: 'Error', statusColor: 'text-red-400', statusIcon: AlertCircle, time: '5m ago' },
];

const initialTasks: OrchestrationTask[] = [
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


export default function HomePage() {
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const { toast } = useToast();
  
  const [systemUptime, setSystemUptime] = useState("0d 0h 0m 0s");

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const uptime = Date.now() - startTime;
      const d = Math.floor(uptime / (1000 * 60 * 60 * 24));
      const h = Math.floor((uptime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((uptime % (1000 * 60)) / 1000);
      setSystemUptime(`${d}d ${h}h ${m}m ${s}s`);
    }, 1000);
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
        operationalMetrics: "System status normal. Key metrics are available in the System Snapshot.",
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
  
  const systemMetrics = [
    { id: 'cpu', icon: Cpu, label: 'CPU Load', value: 35, progressMax: 100, unit: '%' },
    { id: 'memory', icon: HardDrive, label: 'Memory Usage', value: 62, progressMax: 100, unit: '%' },
    { id: 'agents', icon: Users, label: 'Active Agents', value: 5, unit: '' },
    { id: 'disk', icon: HardDrive, label: 'Disk Usage', value: 450, progressMax: 1000, unit: 'GB / 1TB' },
    { id: 'sent', icon: ArrowUpFromLine, label: 'Network Sent', value: 1.2, unit: 'GB' },
    { id: 'received', icon: ArrowDownToLine, label: 'Network Received', value: 8.5, unit: 'GB' },
    { id: 'uptime', icon: Timer, label: 'System Uptime', value: systemUptime, unit: '' },
  ];


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-0 md:p-0"> {/* Adjusted padding to 0 for page, handled by canvas wrapper */}
      {/* Column 1: AI Assistant & Application View */}
      <div className="lg:col-span-1 space-y-6 flex flex-col">
        <MicroAppCard title="AI Assistant" icon={Bot} actions={<CardActions/>} className="flex-grow flex flex-col min-h-[300px] lg:min-h-[400px]">
          <div className="flex flex-col items-center justify-center text-center p-6 flex-grow">
            <Image src="https://placehold.co/150x150.png" alt="AI Assistant Orb" width={120} height={120} className="rounded-full mb-4" data-ai-hint="abstract orb" />
            <p className="text-sm text-muted-foreground mb-4">
              Analyze product sales, compare revenue, or ask for insights.
            </p>
            {aiResponse && <p className="text-sm text-primary-foreground p-3 bg-primary/20 rounded-md mb-4">{aiResponse}</p>}
          </div>
          <form onSubmit={handleAiSubmit} className="p-4 border-t border-border/50">
            <Textarea
              placeholder="Ask the AI assistant..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              rows={2}
              className="bg-input border-border focus:ring-primary mb-2"
            />
            <Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground" disabled={isAiLoading}>
              {isAiLoading ? <LoaderCircle className="animate-spin mr-2"/> : <Send className="mr-2 h-4 w-4" />}
              Send Prompt
            </Button>
          </form>
        </MicroAppCard>

        <MicroAppCard title="Application View" icon={AppWindow} actions={<CardActions/>} className="min-h-[150px]">
          <p className="text-sm text-muted-foreground p-4">Application specific views and controls will appear here.</p>
        </MicroAppCard>
      </div>

      {/* Column 2: System Snapshot & Micro-Apps */}
      <div className="lg:col-span-1 space-y-6">
        <MicroAppCard title="System Snapshot" icon={LayoutGrid} actions={<CardActions/>} className="min-h-[300px]">
          <ul className="space-y-3 p-1">
            {systemMetrics.map(metric => (
              <li key={metric.id} className="text-sm">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center text-muted-foreground">
                    <metric.icon className="w-4 h-4 mr-2 text-primary" />
                    <span>{metric.label}</span>
                  </div>
                  <span className="font-medium text-foreground">
                    {metric.progressMax ? `${metric.value}${metric.unit.startsWith('%') ? '%' : ''}` : metric.value}
                    {!metric.progressMax && metric.unit && !metric.unit.startsWith('%') && ` ${metric.unit}`}
                    {metric.progressMax && metric.unit.includes('/') && ` ${metric.unit.substring(metric.unit.indexOf('/'))}`}
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
        </MicroAppCard>

        <MicroAppCard title="Micro-Apps" icon={Rocket} actions={<CardActions/>} className="min-h-[150px]">
          <div className="flex space-x-3 p-4 justify-around">
            {[1,2,3].map(i => (
              <Button key={i} variant="outline" className="flex flex-col items-center justify-center h-20 w-20 border-dashed border-primary/50 hover:border-primary hover:bg-primary/10 group">
                <ArrowRightSquare className="w-6 h-6 mb-1 text-primary/70 group-hover:text-primary"/>
                <span className="text-xs text-muted-foreground group-hover:text-primary">Launch</span>
              </Button>
            ))}
          </div>
        </MicroAppCard>
      </div>

      {/* Column 3: Agent Presence & Live Orchestration Feed */}
      <div className="lg:col-span-1 space-y-6">
        <MicroAppCard title="Agent Presence" icon={Cpu} actions={<CardActions/>} className="min-h-[300px]">
          <ul className="space-y-3 p-1 max-h-[350px] overflow-y-auto">
            {initialAgents.map(agent => (
              <li key={agent.id} className="p-2.5 rounded-md bg-card hover:bg-muted/30 transition-colors">
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
        </MicroAppCard>

        <MicroAppCard title="Live Orchestration Feed" icon={GitFork} actions={<CardActions/>} className="min-h-[300px] flex flex-col">
          <Accordion type="single" collapsible className="w-full p-1 flex-grow max-h-[350px] overflow-y-auto">
            {initialTasks.map(task => (
              <AccordionItem value={task.id} key={task.id} className="border-b-0 mb-1"> {/* Removed border-b for cleaner look */}
                 <AccordionTrigger className="p-2.5 rounded-md bg-card hover:bg-muted/30 transition-colors hover:no-underline text-sm flex justify-between items-center w-full">
                  <div className="flex items-center text-left">
                     {task.status === 'success' ? <CheckCircle className="w-4 h-4 mr-2 text-green-500 shrink-0"/> : <XCircle className="w-4 h-4 mr-2 text-red-500 shrink-0"/>}
                    <div>
                      <span className="font-medium text-foreground">{task.title}</span>
                      <p className="text-xs text-muted-foreground">{task.time}</p>
                    </div>
                  </div>
                   <Badge variant={task.status === 'success' ? 'secondary' : 'destructive'} className={`capitalize text-xs px-2 py-0.5 ${task.status === 'success' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                    {task.status}
                  </Badge>
                </AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground p-3 mt-0.5 mb-1 bg-muted/20 rounded-b-md">
                  {task.details || "No further details available."}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="p-2 text-right text-xs text-muted-foreground/70 border-t border-border/50 mt-auto">
            ΛΞVON OS v1.0 <span className="font-semibold">SILENT AUTOMATION</span>
          </div>
        </MicroAppCard>
      </div>
    </div>
  );
}
