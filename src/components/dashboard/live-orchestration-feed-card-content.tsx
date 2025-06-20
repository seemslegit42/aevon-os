
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircleIcon, XCircleIcon as XIcon, ChevronDownIcon } from '@/components/icons'; 
import { cn } from "@/lib/utils";
import type { Emitter } from 'mitt';

export interface FeedItem {
  task: string;
  time: string;
  status: 'success' | 'failure';
  details: string;
}

interface LiveOrchestrationFeedCardContentProps {
  feedItems: FeedItem[];
  eventBusInstance?: Emitter<any>;
}

const LiveOrchestrationFeedCardContent: React.FC<LiveOrchestrationFeedCardContentProps> = ({ feedItems, eventBusInstance }) => {
  if (!feedItems || feedItems.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <p className="text-sm text-muted-foreground">No feed items available.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full pr-2">
      <ul className="space-y-3 p-1">
        {feedItems.map((item, index) => (
          <li key={index} className="p-3 rounded-md bg-card/50 hover:bg-primary/10 dark:bg-card/70 dark:hover:bg-primary/10">
            <div className="flex items-start justify-between mb-1">
              <div className="flex items-center">
                 {item.status === 'success' ? <CheckCircleIcon className="w-5 h-5 mr-2 text-green-500 shrink-0" /> : <XIcon className="w-5 h-5 mr-2 text-red-500 shrink-0" />}
                <div>
                  <p className="font-semibold text-foreground text-sm">{item.task}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>
              <span className={cn(
                `text-xs font-semibold px-2.5 py-1 rounded-full leading-none`,
                 item.status === 'success' ? 'badge-success' : 'badge-failure'
                )}>
                {item.status}
              </span>
            </div>
             <button className={cn(
                `text-xs hover:underline flex items-center mt-1`,
                 item.status === 'success' ? 'details-link-success' : 'details-link-failure'
                )}>
              {item.status === 'success' ? 'Success Details' : 'Failure Details'} <ChevronDownIcon className="w-3 h-3 ml-1" />
            </button>
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
};

export default LiveOrchestrationFeedCardContent;
