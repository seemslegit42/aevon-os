
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { LucideIcon } from 'lucide-react';

export interface Agent {
  id: string;
  name: string;
  description: string;
  status: 'Processing' | 'Idle' | 'Error';
  statusColor: string;
  statusIcon: LucideIcon;
  time: string;
}

interface AgentPresenceCardContentProps {
  agents: Agent[];
}

const AgentPresenceCardContent: React.FC<AgentPresenceCardContentProps> = ({ agents }) => {
  return (
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
  );
};

export default AgentPresenceCardContent;

    