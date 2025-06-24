
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Settings, Clock } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCommandPaletteStore } from '@/stores/command-palette.store';
import NotificationCenter from './notification-center';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { mainNavItems } from '@/config/app-registry';
import CommandBar from './command-bar';
import UserMenu from './user-menu';
import { ThemeToggle } from './theme-toggle';
import { useBeepChatStore } from '@/stores/beep-chat.store';

const TopBar: React.FC = () => {
  const [currentTime, setCurrentTime] = useState("--:--");
  const [isMounted, setIsMounted] = useState(false);
  
  const { setOpen: setCommandPaletteOpen } = useCommandPaletteStore();
  const pathname = usePathname();
  const avatarState = useBeepChatStore(state => state.avatarState);
  
  useEffect(() => {
    setIsMounted(true);
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateClock();
    const timerId = setInterval(updateClock, 60000);
    return () => clearInterval(timerId);
  }, []);
  
  const ContextualActions: React.FC = () => {
    const activeNavItem = mainNavItems.find(item => item.id === pathname);

    if (!activeNavItem || !activeNavItem.contextualActions) {
      return null;
    }

    return (
      <div className="border-l border-white/10 ml-2 pl-2">
        {activeNavItem.contextualActions.map((action) => {
           const ActionIcon = action.icon;
           return (
            <Tooltip key={action.label}>
                <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={action.action} className="font-body text-primary-foreground opacity-80 hover:text-primary-foreground hover:opacity-100">
                    <ActionIcon className="w-4 h-4 mr-2" />
                    {action.label}
                </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="glassmorphism-panel border-none"><p>{action.tooltip}</p></TooltipContent>
            </Tooltip>
           )
        })}
      </div>
    );
  };

  return (
    <TooltipProvider delayDuration={0}>
      <header 
        className="topbar-aevos-glass-override flex items-center justify-between h-14 px-4"
        data-avatar-state={avatarState}
      >
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
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                    <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "font-body text-primary-foreground opacity-70 hover:text-primary-foreground hover:opacity-100",
                          pathname === item.id && "opacity-100 bg-primary/10"
                        )}
                    >
                      <Link href={item.id}>
                        <item.icon className="w-4 h-4 mr-2" />
                        <span>{item.label}</span>
                      </Link>
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="glassmorphism-panel border-none"><p>{item.label}</p></TooltipContent>
              </Tooltip>
            ))}
            <ContextualActions />
          </nav>
          <CommandBar />
        </div>

        {/* Right Side: Controls & User Menu */}
        <div className="flex items-center space-x-1">
          <NotificationCenter />
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="w-9 h-9 text-primary-foreground hover:text-primary-foreground/80" onClick={() => setCommandPaletteOpen(true)}>
                <Settings className="h-5 w-5 aevos-icon-styling-override" />
                <span className="sr-only">Settings</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="glassmorphism-panel border-none"><p>Workspace Settings</p></TooltipContent>
          </Tooltip>

          <ThemeToggle />

          <div className="flex items-center text-xs px-2 h-9 font-mono text-primary-foreground opacity-80">
            <Clock className="h-4 w-4 mr-1.5 text-muted-foreground" />
            {isMounted ? currentTime : "--:--"}
          </div>

          <div className="h-6 border-l border-white/10 mx-1.5" />
          
          <UserMenu />
        </div>
      </header>
    </TooltipProvider>
  );
};

export default TopBar;
