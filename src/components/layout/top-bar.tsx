
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Settings, Clock, Menu, Search, BookMarked, FileText } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useCommandPaletteStore } from '@/stores/command-palette.store';
import NotificationCenter from './notification-center';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { mainNavItems } from '@/config/app-registry';
import UserMenu from './user-menu';
import { ThemeToggle } from './theme-toggle';
import { useBeepChatStore } from '@/stores/beep-chat.store';
import { AiFlowGeneratorForm } from '@/app/loom/components/ai-flow-generator';
import { Input } from '../ui/input';
import { useToast } from '@/hooks/use-toast';
import eventBus from '@/lib/event-bus';

// This is the new unified TopBar component.
const TopBar: React.FC = () => {
  const [currentTime, setCurrentTime] = useState("--:--");
  const [isMounted, setIsMounted] = useState(false);
  
  const { setOpen: setCommandPaletteOpen } = useCommandPaletteStore();
  const { toast } = useToast();
  const pathname = usePathname();
  const avatarState = useBeepChatStore(state => state.avatarState);
  const isLoomPage = pathname === '/loom';
  
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
  
  const isNavItemActive = (navItemId: string) => {
    if (navItemId === '/') return pathname === '/';
    return pathname.startsWith(navItemId);
  };
  
  const handleComingSoon = (featureName: string) => {
    toast({
      title: "Coming Soon!",
      description: `${featureName} feature is under development.`,
    });
  };

  const CommandBarInput: React.FC = () => {
    const [commandValue, setCommandValue] = useState('');
    const { append, isLoading } = useBeepChatStore(state => ({ append: state.append, isLoading: state.isLoading }));

    const handleCommandSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (commandValue.trim() && !isLoading) {
        append({ role: 'user', content: commandValue });
        setCommandValue('');
      }
    };

    return (
        <div className="relative w-full max-w-md h-9">
            <form onSubmit={handleCommandSubmit} className="w-full h-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search or ask BEEP..."
                    className={cn("command-bar-input-aevos-override w-full h-9 pl-10 pr-4 text-sm", isLoading && "opacity-50 cursor-not-allowed")}
                    value={commandValue}
                    onChange={(e) => setCommandValue(e.target.value)}
                    disabled={isLoading}
                />
            </form>
        </div>
    );
  }

  const CenterComponent = () => {
      return (
        <div className="flex-1 flex items-center justify-center space-x-6 px-2 md:px-4">
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
                          isNavItemActive(item.id) && "opacity-100 bg-primary/10"
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
          </nav>
          
          {/* Conditional Centerpiece */}
          {isLoomPage ? (
            <div className="w-full max-w-xl"><AiFlowGeneratorForm /></div>
          ) : (
            <CommandBarInput />
          )}
        </div>
      );
  };
  
  return (
    <TooltipProvider delayDuration={0}>
      <header 
        className="topbar-aevos-glass-override flex items-center justify-between h-14 px-4"
        data-avatar-state={avatarState}
      >
        <div className="flex items-center">
          <div className="md:hidden mr-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-9 h-9 text-primary-foreground">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open navigation menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="glassmorphism-panel mt-2">
                <DropdownMenuLabel>Navigation</DropdownMenuLabel>
                {mainNavItems.map((item) => (
                  <DropdownMenuItem key={item.id} asChild className={cn("cursor-pointer", isNavItemActive(item.id) && "bg-accent/20")}>
                    <Link href={item.id}>
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
                 {isLoomPage && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Loom Studio</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => eventBus.emit('loom:open-templates')} className="cursor-pointer">
                      <BookMarked className="mr-2 h-4 w-4" /> Templates
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleComingSoon("Documentation")} className="cursor-pointer">
                      <FileText className="mr-2 h-4 w-4" /> Docs
                    </DropdownMenuItem>
                  </>
                 )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

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
           {isLoomPage && (
            <div className="ml-4 pl-4 border-l border-border/20 hidden md:flex items-center gap-1">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-accent-foreground hover:bg-accent/20" onClick={() => eventBus.emit('loom:open-templates')}>
                    <BookMarked className="mr-1.5 h-4 w-4"/> Templates
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-accent-foreground hover:bg-accent/20" onClick={() => handleComingSoon("Docs")}>
                    <FileText className="mr-1.5 h-4 w-4"/> Docs
                </Button>
            </div>
           )}
        </div>

        <CenterComponent />

        <div className="flex items-center space-x-1">
          <NotificationCenter />
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="w-9 h-9 text-primary-foreground hover:text-primary-foreground/80" onClick={() => setCommandPaletteOpen(true)}>
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="glassmorphism-panel border-none"><p>Workspace Settings</p></TooltipContent>
          </Tooltip>

          <ThemeToggle />

          <div className="hidden md:flex items-center text-xs px-2 h-9 font-mono text-primary-foreground opacity-80">
            <Clock className="h-4 w-4 mr-1.5 text-muted-foreground" />
            {isMounted ? currentTime : "--:--"}
          </div>

          <div className="h-6 border-l border-white/10 mx-1.5 hidden md:block" />
          
          <UserMenu />
        </div>
      </header>
    </TooltipProvider>
  );
};

export default TopBar;
