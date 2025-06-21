
"use client";
import React, { type ElementType } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';

interface Agent {
  id: string;
  name: string;
  description: string;
  status: string;
  statusColor: string;
  statusIcon: ElementType;
  time: string;
  isSpinning?: boolean;
}

interface AgentPresenceCardContentProps {
  agents: Agent[];
}

const AgentPresenceCardContent: React.FC<AgentPresenceCardContentProps> = ({ agents = [] }) => {
  return (
    <ScrollArea className="h-full pr-2">
      <div className="space-y-3">
        {agents.map((agent) => {
          const StatusIcon = agent.statusIcon;
          return (
            <div key={agent.id} className="flex items-start space-x-3 p-2 rounded-lg bg-card/60">
              <StatusIcon className={cn("w-5 h-5 mt-1 shrink-0", agent.statusColor, agent.isSpinning && "animate-spin")} />
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{agent.name}</p>
                <p className="text-xs text-muted-foreground">{agent.description}</p>
                <div className="flex items-center justify-between mt-1">
                    <span className={cn("text-xs font-medium", agent.statusColor)}>{agent.status}</span>
                    <span className="text-xs text-muted-foreground">{agent.time}</span>
                </div>
              </div>
            </div>
          );
        })}
        {agents.length === 0 && (
            <div className="text-center py-6">
                <p className="text-sm text-muted-foreground">No active agents.</p>
            </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default AgentPresenceCardContent;
