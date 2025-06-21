
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
} from "@/components/ui/dropdown-menu"
import eventBus from '@/lib/event-bus';
import { useLayoutStore } from '@/stores/layout.store';
import { useCommandPaletteStore } from '@/stores/command-palette.store';
import { cn } from '@/lib/utils';

interface NavItemConfig {
  id: string; // The card ID to focus on
  label: string;
  icon: ElementType;
}

const mainNavItems: NavItemConfig[] = [
  { id: 'loomStudio', label: 'Loom', icon: LoomIcon },
  { id: 'aegisSecurity', label: 'Λegis', icon: AegisIcon },
  { id: 'armoryMarketplace', label: 'Λrmory', icon: ArmoryIcon },
];

const TopBar: React.FC = () => {
  const [currentTime, setCurrentTime] = useState("--:--");
  const [isMounted, setIsMounted] = useState(false);
  const [commandValue, setCommandValue] = useState('');
  const focusedItemId = useLayoutStore((state) => state.focusedItemId);
  const [isNotifying, setIsNotifying] = useState(false);
  const { toggle: toggleCommandPalette } = useCommandPaletteStore();


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
    const handleNewNotification = () => {
      setIsNotifying(true);
      // Reset the animation class after it has finished
      const timer = setTimeout(() => setIsNotifying(false), 2500); // Must match animation duration
      return () => clearTimeout(timer);
    };
    eventBus.on('notification:new', handleNewNotification);

    return () => {
        eventBus.off('notification:new', handleNewNotification);
    };
  }, []);

  const handleNavClick = (cardId: string) => {
    eventBus.emit('panel:focus', cardId);
  };
  
  const handleCommandSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && commandValue.trim()) {
        e.preventDefault();
        eventBus.emit('command:submit', commandValue);
        setCommandValue(''); // Clear input after submission
    }
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
    // Add other contextual actions here for other focusedCardId values
    // e.g., if (focusedCardId === 'aegisSecurity') { ... }
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
              className="command-bar-input-aevos-override w-full h-9 pl-10 pr-4 text-sm"
              aria-label="Command or search input"
              value={commandValue}
              onChange={(e) => setCommandValue(e.target.value)}
              onKeyDown={handleCommandSubmit}
            />
          </div>
        </div>

        {/* Right Side: Controls & User Menu */}
        <div className="flex items-center space-x-1.5">
           <Tooltip>
            <TooltipTrigger asChild>
               <Button variant="ghost" size="icon" className="w-9 h-9 text-primary-foreground hover:text-primary-foreground/80">
                <BellIcon className={cn("h-5 w-5 aevos-icon-styling-override", isNotifying && "notification-glow-animate")} />
                <span className="sr-only">Notifications</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom"><p>Notifications</p></TooltipContent>
          </Tooltip>

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
