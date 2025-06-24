
"use client";
import React from 'react';
import { CheckCircle, AlertTriangle, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useNotificationStore, type Notification } from '@/stores/notification.store';

const LiveOrchestrationFeedCardContent: React.FC = () => {
  const { toast } = useToast();
  const { notifications } = useNotificationStore();

  const handleViewDetails = (item: Notification) => {
    toast({
      variant: item.status === 'success' ? 'default' : 'destructive',
      title: `Feed Event: ${item.task}`,
      description: (
        <div className="mt-2 w-full text-foreground space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <strong>Status:</strong>
            <Badge variant={item.status === 'success' ? 'default' : 'destructive'} className={cn("border-none", item.status === 'success' ? 'badge-success' : 'badge-failure')}>
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
    <div className="space-y-3 p-4">
      {notifications.map((item, index) => (
          <div key={index} className="flex items-start space-x-3 text-xs">
          <div className="flex-shrink-0 pt-0.5">
              {item.status === 'success' ? (
              <CheckCircle className="w-4 h-4 text-chart-4" />
              ) : (
              <AlertTriangle className="w-4 h-4 text-chart-5" />
              )}
          </div>
          <div className="flex-1 overflow-hidden">
              <div className="flex justify-between items-baseline">
                  <p className="font-semibold text-foreground truncate">{item.task}</p>
                  <p className="text-muted-foreground">{item.time}</p>
              </div>
              <p className="text-muted-foreground mt-0.5 break-words">{item.details}</p>
                <button onClick={() => handleViewDetails(item)} className={cn("inline-flex items-center text-xs mt-1 hover:underline", item.status === 'success' ? 'details-link-success' : 'details-link-failure')}>
                    View Details <ChevronRight className="w-3 h-3 ml-1" />
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
  );
};

export default LiveOrchestrationFeedCardContent;
