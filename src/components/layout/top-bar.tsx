
"use client";

import React, { useState, useEffect, type ElementType } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
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
import { cn } from '@/lib/utils';

interface NavItemConfig {
  href: string;
  label: string;
  icon: ElementType;
}

const mainNavItems: NavItemConfig[] = [
  { href: '/loom-studio', label: 'Loom', icon: LoomIcon },
  { href: '/aegis-security', label: 'Λegis', icon: AegisIcon },
  { href: '/armory', label: 'Λrmory', icon: ArmoryIcon },
];

const TopBar: React.FC = () => {
  const pathname = usePathname();
  const [currentTime, setCurrentTime] = useState("--:--");
  const [isMounted, setIsMounted] = useState(false);

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

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
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
              <Link key={item.href} href={item.href} passHref>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "font-body",
                    isActive(item.href)
                      ? "bg-white/5 text-primary-foreground font-semibold" 
                      : "text-primary-foreground opacity-70 hover:text-primary-foreground hover:opacity-100"
                  )}
                >
                  <item.icon className="w-4 h-4 mr-2 aevos-icon-styling-override" />
                  <span className={cn(isActive(item.href) ? "text-primary-foreground" : "text-primary-foreground opacity-70")}>{item.label}</span>
                </Button>
              </Link>
            ))}
          </nav>
          <div className="relative w-full max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 aevos-icon-styling-override text-primary-foreground" />
            <Input
              type="search"
              placeholder="Search or ask 'show my tasks'..."
              className="command-bar-input-aevos-override w-full h-9 pl-10 pr-4 text-sm"
              aria-label="Command or search input"
            />
          </div>
        </div>

        {/* Right Side: Controls & User Menu */}
        <div className="flex items-center space-x-1.5">
           <Tooltip>
            <TooltipTrigger asChild>
               <Button variant="ghost" size="icon" className="w-9 h-9 text-primary-foreground hover:text-primary-foreground/80">
                <BellIcon className="h-5 w-5 aevos-icon-styling-override" />
                <span className="sr-only">Notifications</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom"><p>Notifications</p></TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="w-9 h-9 text-primary-foreground hover:text-primary-foreground/80">
                <GearIcon className="h-5 w-5 aevos-icon-styling-override" />
                <span className="sr-only">Settings</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom"><p>Settings</p></TooltipContent>
          </Tooltip>

          <div className="flex items-center text-xs px-2 h-9 font-body text-primary-foreground opacity-80">
            <ClockIcon className="h-4 w-4 mr-1.5 aevos-icon-styling-override text-primary-foreground" />
            {isMounted ? currentTime : "--:--"}
          </div>
           <div className="hidden md:flex items-center text-xs px-1 h-9 border-l border-white/10 ml-1 pl-2.5 font-body text-primary-foreground opacity-80">
              Admin User <span className="mx-1 text-primary-foreground/70">|</span> Session: <span className="text-accent font-medium ml-1">Active</span>
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
    
