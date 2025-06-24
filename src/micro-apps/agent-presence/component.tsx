
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { getAgentsWithStatus, type AgentWithStatus } from '@/services/agent.service';
import { Skeleton } from '@/components/ui/skeleton';

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
  const [agents, setAgents] = useState<AgentWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAgents = useCallback(async () => {
      try {
          // No need to set loading to true on refetch
          const fetchedAgents = await getAgentsWithStatus();
          setAgents(fetchedAgents);
      } catch (error) {
          console.error("Failed to fetch agent presence:", error);
      } finally {
          setIsLoading(false);
      }
  }, []);

  useEffect(() => {
    fetchAgents();
    const interval = setInterval(fetchAgents, 15000); // Refresh every 15 seconds
    return () => clearInterval(interval);
  }, [fetchAgents]);
  
  if (isLoading) {
      return (
          <div className="space-y-3 p-4">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
          </div>
      );
  }

  return (
    <TooltipProvider>
      <div className="space-y-3 p-4">
        {agents.map((agent) => (
          <Tooltip key={agent.id}>
            <TooltipTrigger asChild>
              <Card className="p-3 bg-card/50 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={`https://placehold.co/40x40.png`} alt={agent.name} data-ai-hint="abstract geometric" />
                    <AvatarFallback>{agent.name.substring(0, 2)}</AvatarFallback>
                     <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-card" >
                        <span className={cn('absolute inline-flex h-full w-full rounded-full opacity-75', statusPing[agent.status])} />
                        <span className={cn('relative inline-flex rounded-full h-2.5 w-2.5', statusPing[agent.status].replace('animate-ping ', ''))} />
                    </span>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-semibold truncate">{agent.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{agent.lastTask}</p>
                  </div>
                  <Badge variant="outline" className={cn('text-xs capitalize', statusStyles[agent.status])}>
                    {agent.status}
                  </Badge>
                </div>
              </Card>
            </TooltipTrigger>
            <TooltipContent side="top" className="glassmorphism-panel">
              <p>Last Task: {agent.lastTask}</p>
            </TooltipContent>
          </Tooltip>
        ))}
         {agents.length === 0 && (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">No agents found or registered.</p>
            <p className="text-xs text-muted-foreground">The 'BEEP' system agent should appear here automatically after an action.</p>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default AgentPresenceCardContent;
