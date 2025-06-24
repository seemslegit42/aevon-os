
"use client";
import React, { useEffect } from 'react';
import { CheckCircle, Warning, CaretDown } from 'phosphor-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../components/ui/scroll-area';
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import eventBus from '@/lib/event-bus';
import { useNotificationStore, type Notification } from '@/stores/notification.store';

const LiveOrchestrationFeedCardContent: React.FC = () => {
  const { toast } = useToast();
  const { notifications } = useNotificationStore();

  const handleViewDetails = (item: Notification) => {
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
        {notifications.map((item, index) => (
            <div key={index} className="flex items-start space-x-3 text-xs">
            <div className="flex-shrink-0 pt-0.5">
                {item.status === 'success' ? (
                <CheckCircle className="w-4 h-4 text-chart-4" />
                ) : (
                <Warning className="w-4 h-4 text-chart-5" />
                )}
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-baseline">
                    <p className="font-semibold text-foreground">{item.task}</p>
                    <p className="text-muted-foreground">{item.time}</p>
                </div>
                <p className="text-muted-foreground mt-0.5">{item.details}</p>
                 <button onClick={() => handleViewDetails(item)} className={cn("inline-flex items-center text-xs mt-1 hover:underline", item.status === 'success' ? 'details-link-success' : 'details-link-failure')}>
                     View Details <CaretDown className="w-3 h-3 ml-1 -rotate-90" />
                </button>
            </div>
            </div>
        ))}
        {notifications.length === 0 && (
             <div className="text-center py-6">
                <p className="text-sm text-muted-foreground">No feed items available.</p>
            </div>
        )}
        </div>
    </ScrollArea>
  );
};

export default LiveOrchestrationFeedCardContent;
