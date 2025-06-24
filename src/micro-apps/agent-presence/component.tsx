
"use client";

import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface Agent {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'error';
  task: string;
  avatar: string;
  avatarHint: string;
}

const initialAgents: Agent[] = [
  { id: 'agent-001', name: 'OrchestratorAlpha', status: 'active', task: 'Analyzing sales data for Q2 report...', avatar: 'https://placehold.co/40x40.png', avatarHint: 'abstract purple' },
  { id: 'agent-002', name: 'WebIntellectX', status: 'idle', task: 'Awaiting new web summarization tasks.', avatar: 'https://placehold.co/40x40.png', avatarHint: 'abstract green' },
  { id: 'agent-003', name: 'SynthWeaver', status: 'active', task: 'Generating marketing copy for new campaign.', avatar: 'https://placehold.co/40x40.png', avatarHint: 'abstract blue' },
  { id: 'agent-004', name: 'DataCruncherZeta', status: 'error', task: 'Failed to connect to primary database.', avatar: 'https://placehold.co/40x40.png', avatarHint: 'abstract red' },
];

const statusStyles = {
  active: 'bg-chart-4/20 text-chart-4 border-chart-4/30',
  idle: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  error: 'bg-destructive/20 text-destructive border-destructive/30',
};

const statusPing = {
    active: 'animate-ping bg-chart-4',
    idle: 'bg-blue-400',
    error: 'animate-ping bg-destructive',
}

const AgentPresenceCardContent: React.FC = () => {
  const [agents, setAgents] = useState(initialAgents);

  // Simulate status changes for a more dynamic feel
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prevAgents => prevAgents.map(agent => {
        if (agent.status !== 'error' && Math.random() > 0.7) {
          return { ...agent, status: agent.status === 'idle' ? 'active' : 'idle' };
        }
        return agent;
      }));
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <TooltipProvider>
      <ScrollArea className="h-full pr-3">
        <div className="space-y-3">
          {agents.map((agent) => (
            <Tooltip key={agent.id}>
              <TooltipTrigger asChild>
                <Card className="p-3 bg-card/50 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={agent.avatar} alt={agent.name} data-ai-hint={agent.avatarHint} />
                      <AvatarFallback>{agent.name.substring(0, 2)}</AvatarFallback>
                       <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-card" >
                          <span className={cn('absolute inline-flex h-full w-full rounded-full opacity-75', statusPing[agent.status])} />
                          <span className={cn('relative inline-flex rounded-full h-2.5 w-2.5', statusPing[agent.status].replace('animate-ping ', ''))} />
                      </span>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-semibold truncate">{agent.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{agent.task}</p>
                    </div>
                    <Badge variant="outline" className={cn('text-xs capitalize', statusStyles[agent.status])}>
                      {agent.status}
                    </Badge>
                  </div>
                </Card>
              </TooltipTrigger>
              <TooltipContent side="top" className="glassmorphism-panel">
                <p>Task: {agent.task}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </ScrollArea>
    </TooltipProvider>
  );
};

export default AgentPresenceCardContent;
