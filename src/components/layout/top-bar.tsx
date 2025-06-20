
"use client";

import React, { useState, useEffect, type ElementType } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  MoonIcon,
  SunIcon,
  SearchIcon,
  Settings2Icon as LoomIcon, 
  ShieldCheckIcon as AegisIcon, 
  CreditCardIcon as ArmoryIcon, 
  BellIcon,
  Settings2Icon, 
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
import { useThemeStore } from '@/stores/theme.store';

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
  const { theme, toggleTheme } = useThemeStore(
    (state) => ({ theme: state.theme, toggleTheme: state.toggleTheme })
  );

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
      <header className={cn(
        "sticky top-0 z-50 w-full topbar-aevos-glass font-body text-foreground",
      )}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Left Side: Branding */}
          <div className="flex items-center space-x-2">
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
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "font-body hover:bg-primary/10 dark:hover:bg-primary/20", // Adjusted dark hover
                      isActive(item.href) 
                        ? "bg-primary/15 dark:bg-primary/25 text-primary dark:text-primary-foreground font-semibold" 
                        : "text-muted-foreground dark:text-muted-foreground hover:text-primary dark:hover:text-primary-foreground" // Use muted-foreground for dark inactive
                    )}
                  >
                    <item.icon className="w-4 h-4 mr-2 aevos-icon-style" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>
            <div className="relative w-full max-w-md">
               <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground aevos-icon-style" />
              <Input
                type="search"
                placeholder="Search or ask 'show my tasks'..."
                className={cn(
                  "w-full h-9 pl-10 pr-4 command-bar-input-aevos font-body",
                  "text-sm placeholder:text-muted-foreground" 
                )}
                aria-label="Command or search input"
              />
            </div>
          </div>

          {/* Right Side: Controls & User Menu */}
          <div className="flex items-center space-x-1.5 font-body">
             <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="w-9 h-9"
                  aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
                >
                  {isMounted && theme === 'dark' ? <SunIcon className="h-5 w-5 aevos-icon-style" /> : <MoonIcon className="h-5 w-5 aevos-icon-style" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom"><p>Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode</p></TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                 <Button variant="ghost" size="icon" className="w-9 h-9">
                  <BellIcon className="h-5 w-5 aevos-icon-style" />
                  <span className="sr-only">Notifications</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom"><p>Notifications</p></TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="w-9 h-9">
                  <Settings2Icon className="h-5 w-5 aevos-icon-style" />
                  <span className="sr-only">Settings</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom"><p>Settings</p></TooltipContent>
            </Tooltip>

            <div className="flex items-center text-xs text-muted-foreground px-2 h-9">
              <ClockIcon className="h-4 w-4 mr-1.5 aevos-icon-style" />
              {isMounted ? currentTime : "--:--"}
            </div>
             <div className="hidden md:flex items-center text-xs text-muted-foreground px-1 h-9 border-l border-border/20 dark:border-border/30 ml-1 pl-2.5">
                Admin User <span className="mx-1">|</span> Session: <span className="text-accent font-medium ml-1">Active</span>
            </div>


            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 h-9 px-2.5">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="https://placehold.co/40x40.png" alt="User" data-ai-hint="user avatar" />
                    <AvatarFallback className="text-xs bg-primary/30 text-primary-foreground">AU</AvatarFallback>
                  </Avatar>
                  <ChevronDownIcon className="h-4 w-4 opacity-80 aevos-icon-style" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glassmorphism-panel border-border/30 dark:border-border/50">
                <DropdownMenuLabel className="font-headline text-primary dark:text-primary-foreground">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/20 dark:bg-border/30"/>
                <DropdownMenuItem className="font-body hover:!bg-accent/10 dark:hover:!bg-accent/20 focus:bg-accent focus:text-accent-foreground">Profile</DropdownMenuItem>
                <DropdownMenuItem className="font-body hover:!bg-accent/10 dark:hover:!bg-accent/20 focus:bg-accent focus:text-accent-foreground">Billing</DropdownMenuItem>
                <DropdownMenuItem className="font-body hover:!bg-accent/10 dark:hover:!bg-accent/20 focus:bg-accent focus:text-accent-foreground">Settings</DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/20 dark:bg-border/30"/>
                <DropdownMenuItem className="font-body hover:!bg-accent/10 dark:hover:!bg-accent/20 focus:bg-accent focus:text-accent-foreground">Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
};

export default TopBar;


    