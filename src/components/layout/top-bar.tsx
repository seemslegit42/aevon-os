
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Home, 
  Settings, 
  Shield, 
  ShoppingCart, 
  Bell, 
  Settings2, 
  Clock, 
  ChevronDown, 
  BrainCircuit,
  type LucideIcon 
} from 'lucide-react';
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
  icon: LucideIcon;
}

const mainNavItems: NavItemConfig[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/loom-studio', label: 'Loom Studio', icon: Settings },
  { href: '/aegis-security', label: 'Aegis Security', icon: Shield },
  { href: '/armory', label: 'Λrmory', icon: ShoppingCart },
];

const TopBar: React.FC = () => {
  const pathname = usePathname();
  const [currentTime, setCurrentTime] = useState("--:--");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const updateClock = () => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateClock();
    const timerId = setInterval(updateClock, 60000); // Update every minute

    return () => clearInterval(timerId);
  }, [isMounted]);

  return (
    <TooltipProvider delayDuration={0}>
      <header className="sticky top-0 z-50 w-full topbar-custom-bg font-headline text-gray-800 dark:text-primary-foreground">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Left Side: Logo and Navigation */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-2xl font-bold flex items-center">
              <BrainCircuit className="w-7 h-7 mr-2 text-white" />
               <span className="text-accent dark:text-white">ΛΞVON OS</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-1">
              {mainNavItems.map((item) => (
                <Link key={item.href} href={item.href} passHref legacyBehavior>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "text-primary-foreground hover:text-primary-foreground hover:bg-primary/20 dark:hover:bg-white/10",
                      (pathname === item.href || (item.href === '/' && pathname.startsWith('/dashboard'))) && "active-nav-link-dark font-semibold" 
                    )}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>

          {/* Center: Search Bar */}
          <div className="flex-1 flex justify-center px-8 lg:px-16">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-foreground" />
              <Input
                type="search"
                placeholder="Command or Search (Ctrl+K)..."
                className="w-full h-9 pl-10 pr-16 bg-background/50 dark:bg-white/5 border-border/50 dark:border-white/20 text-sm text-primary-foreground dark:text-primary-foreground placeholder-muted-foreground dark:placeholder-neutral-400 focus:ring-primary focus:border-primary"
                aria-label="Command or search input"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-muted/50 bg-muted/20 px-1.5 font-mono text-[10px] font-medium text-primary-foreground opacity-100">
                  ⌘K
                </kbd>
              </div>
            </div>
          </div>
          
          {/* Right Side: Controls & User Menu */}
          <div className="flex items-center space-x-1.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/20 dark:hover:bg-white/10 w-9 h-9">
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">Notifications</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom"><p>Notifications</p></TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/20 dark:hover:bg-white/10 w-9 h-9">
                  <Settings2 className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom"><p>Settings</p></TooltipContent>
            </Tooltip>

            <div className="flex items-center text-sm text-primary-foreground px-2 h-9">
              <Clock className="h-4 w-4 mr-1.5" />
              {isMounted ? currentTime : "--:--"}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 h-9 px-2.5 text-primary-foreground hover:bg-primary/20 dark:hover:bg-white/10">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="https://placehold.co/40x40.png" alt="User" data-ai-hint="user avatar" />
                    <AvatarFallback className="text-xs bg-primary/30 text-primary-foreground">U</AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4 opacity-80" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glassmorphism-panel border-border/50">
                <DropdownMenuLabel className="font-headline text-primary">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/30"/>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/30"/>
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
};

export default TopBar;
    
