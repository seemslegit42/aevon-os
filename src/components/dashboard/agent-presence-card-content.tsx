
import React, { type ElementType } from 'react'; // Added ElementType
import { ScrollArea } from '@/components/ui/scroll-area';
// LucideIcon is no longer used directly here, but ElementType from React for icon prop
import { cn } from '@/lib/utils';
import type { Emitter } from 'mitt';

export interface Agent {
  id: string;
  name: string;
  description: string;
  status: 'Processing' | 'Idle' | 'Error';
  statusColor: string;
  statusIcon: ElementType; // Changed from LucideIcon
  time: string;
}

interface AgentPresenceCardContentProps {
  agents: Agent[];
  eventBusInstance?: Emitter<any>;
}

const AgentPresenceCardContent: React.FC<AgentPresenceCardContentProps> = ({ agents, eventBusInstance }) => {
  if (!agents || agents.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <p className="text-sm text-muted-foreground">No active agents.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full pr-1">
      <ul className="space-y-2 p-1">
        {agents.map(agent => {
          const StatusIconComponent = agent.statusIcon; // Assign to a capitalized variable for JSX
          return (
            <li key={agent.id} className="p-2.5 rounded-md bg-card/50 hover:bg-primary/10 dark:bg-black/20 dark:hover:bg-primary/10 transition-colors">
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-semibold text-foreground text-sm">{agent.name}</span>
                <div className="flex items-center text-xs">
                  <StatusIconComponent className={cn( // Use the capitalized variable
                      "w-3.5 h-3.5 mr-1.5 shrink-0",
                      agent.statusColor,
                      agent.status === 'Processing' ? 'animate-spin' : '' // Note: custom static icons won't animate by default
                    )}
                  />
                  <span className={cn("font-medium", agent.statusColor)}>{agent.status}</span>
                  <span className="text-muted-foreground ml-1.5">({agent.time})</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground truncate">{agent.description}</p>
            </li>
          );
        })}
      </ul>
    </ScrollArea>
  );
};

export default AgentPresenceCardContent;
