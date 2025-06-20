
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils'; // For conditional class names

export interface Agent {
  id: string;
  name: string;
  description: string;
  status: 'Processing' | 'Idle' | 'Error';
  statusColor: string; // e.g. text-green-400, text-yellow-400, text-red-400
  statusIcon: LucideIcon;
  time: string;
}

interface AgentPresenceCardContentProps {
  agents: Agent[];
}

const AgentPresenceCardContent: React.FC<AgentPresenceCardContentProps> = ({ agents }) => {
  if (!agents || agents.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <p className="text-sm text-muted-foreground">No active agents.</p>
      </div>
    );
  }

  return (
    // Reduced padding from p-1 to p-0 to minimize scrollbar appearance when not needed
    <ScrollArea className="h-full pr-1"> 
      <ul className="space-y-2 p-1"> {/* Added p-1 back for item spacing */}
        {agents.map(agent => ( 
          <li key={agent.id} className="p-2.5 rounded-md bg-card hover:bg-primary/5 dark:bg-black/10 dark:hover:bg-primary/10 transition-colors">
            <div className="flex items-center justify-between mb-0.5">
              <span className="font-semibold text-foreground text-sm">{agent.name}</span>
              <div className="flex items-center text-xs">
                <agent.statusIcon className={cn(
                    "w-3.5 h-3.5 mr-1.5", 
                    agent.statusColor,
                    agent.status === 'Processing' ? 'animate-spin' : ''
                  )} 
                />
                <span className={agent.statusColor}>{agent.status}</span>
                <span className="text-muted-foreground ml-1.5">({agent.time})</span>
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
