
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, X, ChevronDown } from 'lucide-react';

export interface FeedItem {
  task: string;
  time: string;
  status: 'success' | 'failure';
  details: string;
}

interface LiveOrchestrationFeedCardContentProps {
  feedItems: FeedItem[];
}

const LiveOrchestrationFeedCardContent: React.FC<LiveOrchestrationFeedCardContentProps> = ({ feedItems }) => {
  if (!feedItems || feedItems.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-muted-foreground">No feed items available.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full pr-2">
      <ul className="space-y-3 p-1">
        {feedItems.map((item, index) => (
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
  );
};

export default LiveOrchestrationFeedCardContent;
