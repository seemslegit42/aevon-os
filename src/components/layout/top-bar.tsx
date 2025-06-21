
"use client";

import React, { useState, useEffect, type ElementType } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  SearchIcon,
  Settings2Icon as LoomIcon,
  ShieldCheckIcon as AegisIcon,
  CreditCardIcon as ArmoryIcon,
  BellIcon,
  GearIcon,
  ClockIcon,
  ChevronDownIcon,
  UsersIcon,
  ZapIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  Trash2Icon
} from '@/components/icons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import eventBus from '@/lib/event-bus';
import { useLayoutStore } from '@/stores/layout.store';
import { useCommandPaletteStore } from '@/stores/command-palette.store';
import { useNotificationStore, type Notification } from '@/stores/notification.store';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';

interface NavItemConfig {
  id: string; // The card ID to focus on
  label: string;
  icon: ElementType;
}

const mainNavItems: NavItemConfig[] = [
  { id: 'loomStudio', label: 'Loom', icon: LoomIcon },
  { id: 'aegisSecurity', label: 'Λegis', icon: AegisIcon },
];

const TopBar: React.FC = () => {
  const [currentTime, setCurrentTime] = useState("--:--");
  const [isMounted, setIsMounted] = useState(false);
  const [commandValue, setCommandValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const focusedItemId = useLayoutStore((state) => state.focusedItemId);
  const { toggle: toggleCommandPalette } = useCommandPaletteStore();
  
  // Notification state
  const { notifications, unreadCount, addNotification, markAsRead, markAllAsRead, clearAll } = useNotificationStore();
  const [isNotifying, setIsNotifying] = useState(false);


  useEffect(() => {
    setIsMounted(true);
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
    };
    updateClock();
    const timerId = setInterval(updateClock, 60000);
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    const handleNewNotification = (logData: any) => {
      // Trigger glow animation
      setIsNotifying(true);
      const timer = setTimeout(() => setIsNotifying(false), 2500); // Must match animation duration
      
      // Add to store
      addNotification(logData);

      return () => clearTimeout(timer);
    };

    // Use orchestration log for permanent notifications
    eventBus.on('orchestration:log', handleNewNotification);

    return () => {
        eventBus.off('orchestration:log', handleNewNotification);
    };
  }, [addNotification]);

  const handleNavClick = (cardId: string) => {
    eventBus.emit('panel:focus', cardId);
  };
  
  const handleCommandSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && commandValue.trim() && !isSubmitting) {
        e.preventDefault();
        eventBus.emit('command:submit', commandValue);
        setIsSubmitting(true);
        // This gives the user time to see their command was accepted.
        setTimeout(() => {
            setCommandValue('');
            setIsSubmitting(false);
        }, 2000);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (notification.targetId) {
      eventBus.emit('panel:focus', notification.targetId);
    }
    markAsRead(notification.id);
  };

  const ContextualActions: React.FC = () => {
    if (focusedItemId === 'loomStudio') {
      return (
        <div className="border-l border-white/10 ml-2 pl-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="font-body text-primary-foreground opacity-80 hover:text-primary-foreground hover:opacity-100">
                <ZapIcon className="w-4 h-4 mr-2 aevos-icon-styling-override" />
                New Workflow
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom"><p>Create a new workflow in Loom Studio</p></TooltipContent>
          </Tooltip>
        </div>
      );
    }
    return null;
  };

  return (
    <TooltipProvider delayDuration={0}>
      <header className="topbar-aevos-glass-override flex items-center justify-between">
        {/* Left Side: Branding */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/aevon-logo.png"
              alt="Aevon OS Logo"
              width={112}
              height={28}
              className="h-7 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Center: Navigation & Command Bar */}
        <div className="flex-1 flex items-center justify-center space-x-6 px-4">
          <nav className="hidden md:flex items-center space-x-1">
            {mainNavItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className="font-body text-primary-foreground opacity-70 hover:text-primary-foreground hover:opacity-100"
                onClick={() => handleNavClick(item.id)}
              >
                <item.icon className="w-4 h-4 mr-2 aevos-icon-styling-override" />
                <span>{item.label}</span>
              </Button>
            ))}
            <ContextualActions />
          </nav>
          <div className="relative w-full max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 aevos-icon-styling-override text-primary-foreground" />
            <Input
              type="search"
              placeholder="Search or ask 'show my tasks'..."
              className={cn(
                "command-bar-input-aevos-override w-full h-9 pl-10 pr-4 text-sm",
                isSubmitting && "opacity-50 cursor-not-allowed"
              )}
              aria-label="Command or search input"
              value={commandValue}
              onChange={(e) => setCommandValue(e.target.value)}
              onKeyDown={handleCommandSubmit}
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Right Side: Controls & User Menu */}
        <div className="flex items-center space-x-1.5">
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="w-9 h-9 text-primary-foreground hover:text-primary-foreground/80 relative">
                    <BellIcon className={cn("h-5 w-5 aevos-icon-styling-override", isNotifying && "notification-glow-animate")} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                    <span className="sr-only">Notifications</span>
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom"><p>Notifications</p></TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="w-80 md:w-96 glassmorphism-panel mt-2 p-0">
               <DropdownMenuLabel className="flex items-center justify-between p-2 font-headline text-primary-foreground">
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
                          <CheckCircleIcon className="w-4 h-4 text-chart-4" />
                        ) : (
                          <AlertTriangleIcon className="w-4 h-4 text-chart-5" />
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
                    <Trash2Icon /> Clear all notifications
                  </DropdownMenuItem>
                </>
               )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="w-9 h-9 text-primary-foreground hover:text-primary-foreground/80" onClick={toggleCommandPalette}>
                <GearIcon className="h-5 w-5 aevos-icon-styling-override" />
                <span className="sr-only">Settings</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom"><p>Dashboard Settings</p></TooltipContent>
          </Tooltip>

          <div className="flex items-center text-xs px-2 h-9 font-body text-primary-foreground opacity-80">
            <ClockIcon className="h-4 w-4 mr-1.5 aevos-icon-styling-override text-primary-foreground" />
            {isMounted ? currentTime : "--:--"}
          </div>
           <div className="hidden md:flex items-center text-xs px-2 h-9 border-l border-white/10 ml-1 pl-3 space-x-2 font-body text-primary-foreground opacity-80">
            <div className="flex items-center">
                <span>Admin User</span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 h-9 px-2.5">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="https://placehold.co/40x40.png" alt="User" data-ai-hint="user avatar" />
                  <AvatarFallback className="text-xs bg-primary/50 text-primary-foreground">AU</AvatarFallback>
                </Avatar>
                <ChevronDownIcon className="h-4 w-4 opacity-80 aevos-icon-styling-override text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glassmorphism-panel mt-2">
              <DropdownMenuLabel className="font-headline text-primary-foreground">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/30"/>
              <DropdownMenuItem className="font-body text-primary-foreground hover:!bg-accent/20 focus:bg-accent focus:text-accent-foreground">Profile</DropdownMenuItem>
              <DropdownMenuItem className="font-body text-primary-foreground hover:!bg-accent/20 focus:bg-accent focus:text-accent-foreground">Billing</DropdownMenuItem>
              <DropdownMenuItem className="font-body text-primary-foreground hover:!bg-accent/20 focus:bg-accent focus:text-accent-foreground">Settings</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/30"/>
              <DropdownMenuItem className="font-body text-primary-foreground hover:!bg-accent/20 focus:bg-accent focus:text-accent-foreground">Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </TooltipProvider>
  );
};

export default TopBar;
