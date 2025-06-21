
"use client";
import React from 'react';
import { CheckCircleIcon, AlertTriangleIcon, ArrowRightIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface FeedItem {
  task: string;
  time: string;
  status: 'success' | 'failure';
  details: string;
}

interface LiveOrchestrationFeedCardContentProps {
  feedItems: FeedItem[];
}

const LiveOrchestrationFeedCardContent: React.FC<LiveOrchestrationFeedCardContentProps> = ({ feedItems = [] }) => {
  const { toast } = useToast();

  const handleViewDetails = (item: FeedItem) => {
    toast({
      title: `Feed Event: ${item.task}`,
      description: (
        <div className="mt-2 w-full text-foreground space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <strong>Status:</strong>
            <Badge variant={item.status === 'success' ? "default" : "destructive"} className={cn("border-none", item.status === 'success' ? 'badge-success' : 'badge-failure')}>
              {item.status}
            </Badge>
          </div>
          <p><strong>Timestamp:</strong> {item.time}</p>
          <p><strong>Details:</strong> {item.details}</p>
        </div>
      ),
    });
  };

  return (
    <ScrollArea className="h-full pr-3">
        <div className="space-y-3">
        {feedItems.map((item, index) => (
            <div key={index} className="flex items-start space-x-3 text-xs">
            <div className="flex-shrink-0 pt-0.5">
                {item.status === 'success' ? (
                <CheckCircleIcon className="w-4 h-4 text-chart-4" />
                ) : (
                <AlertTriangleIcon className="w-4 h-4 text-chart-5" />
                )}
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-baseline">
                    <p className="font-semibold text-foreground">{item.task}</p>
                    <p className="text-muted-foreground">{item.time}</p>
                </div>
                <p className="text-muted-foreground mt-0.5">{item.details}</p>
                 <button onClick={() => handleViewDetails(item)} className={cn("inline-flex items-center text-xs mt-1 hover:underline", item.status === 'success' ? 'details-link-success' : 'details-link-failure')}>
                     View Details <ArrowRightIcon className="w-3 h-3 ml-1" />
                </button>
            </div>
            </div>
        ))}
        {feedItems.length === 0 && (
             <div className="text-center py-6">
                <p className="text-sm text-muted-foreground">No feed items available.</p>
            </div>
        )}
        </div>
    </ScrollArea>
  );
};

export default LiveOrchestrationFeedCardContent;
