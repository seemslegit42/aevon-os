
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, CheckCircle, AlertTriangle, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu";
import { useNotificationStore, type Notification } from '@/stores/notification.store';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import eventBus from '@/lib/event-bus';

const NotificationCenter: React.FC = () => {
    const { notifications, unreadCount, addNotification, markAsRead, markAllAsRead, clearAll } = useNotificationStore();
    const [isNotifying, setIsNotifying] = useState(false);

    useEffect(() => {
        const handleNewNotification = (logData: any) => {
          setIsNotifying(true);
          const timer = setTimeout(() => setIsNotifying(false), 2500); // Must match animation duration
          addNotification(logData);
          return () => clearTimeout(timer);
        };

        eventBus.on('orchestration:log', handleNewNotification);
        return () => {
            eventBus.off('orchestration:log', handleNewNotification);
        };
    }, [addNotification]);

    const handleNotificationClick = (notification: Notification) => {
        if (notification.targetId) {
            eventBus.emit('panel:focus', notification.targetId);
        }
        markAsRead(notification.id);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-9 h-9 text-primary-foreground hover:text-primary-foreground/80 relative">
                <Bell className={cn("h-5 w-5 aevos-icon-styling-override", isNotifying && "notification-glow-animate")} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
                    {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
                <span className="sr-only">Notifications</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 md:w-96 glassmorphism-panel mt-2 p-0">
                <DropdownMenuLabel className="flex items-center justify-between p-2 font-headline text-foreground">
                Notifications
                {notifications.length > 0 && <Button variant="link" size="sm" className="h-auto p-0 text-xs text-muted-foreground" onClick={markAllAsRead}>Mark all as read</Button>}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/30 m-0"/>
                {notifications.length > 0 ? (
                <ScrollArea className="h-auto max-h-96">
                    <DropdownMenuGroup className="p-1">
                    {notifications.map((n) => (
                    <DropdownMenuItem 
                        key={n.id} 
                        className={cn(
                            "flex items-start gap-3 !p-3 cursor-pointer hover:!bg-accent/20 focus:bg-accent focus:text-accent-foreground",
                            !n.read && "bg-primary/10"
                        )}
                        onClick={() => handleNotificationClick(n)}
                    >
                        <div className="flex-shrink-0 pt-0.5">
                        {n.status === 'success' ? (
                            <CheckCircle className="w-4 h-4 text-chart-4" />
                        ) : (
                            <AlertTriangle className="w-4 h-4 text-chart-5" />
                        )}
                        </div>
                        <div className="flex-1 text-xs">
                            <div className="flex justify-between items-baseline">
                                <p className="font-semibold text-foreground">{n.task}</p>
                                <p className="text-muted-foreground">{n.time}</p>
                            </div>
                            <p className="text-muted-foreground mt-0.5">{n.details}</p>
                        </div>
                    </DropdownMenuItem>
                    ))}
                    </DropdownMenuGroup>
                </ScrollArea>
                ) : (
                <div className="text-center text-sm text-muted-foreground p-8">
                    <p>No new notifications</p>
                </div>
                )}
                {notifications.length > 0 && (
                <>
                    <DropdownMenuSeparator className="bg-border/30 m-0"/>
                    <DropdownMenuItem 
                    className="flex items-center justify-center gap-2 !p-2 cursor-pointer text-muted-foreground hover:!text-destructive hover:!bg-destructive/10"
                    onClick={clearAll}
                    >
                    <Trash2 /> Clear all notifications
                    </DropdownMenuItem>
                </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default NotificationCenter;
