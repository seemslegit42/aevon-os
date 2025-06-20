
"use client";

import React, { useState, useEffect, type ElementType } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  MoonIcon,
  SunIcon,
  SearchIcon,
  HomeIcon,
  Settings2Icon as SettingsIcon, 
  ShieldCheckIcon as ShieldIcon, 
  CreditCardIcon as ShoppingCartIcon, 
  BellIcon,
  Settings2Icon,
  ClockIcon,
  ChevronDownIcon,
  UserIcon,
  CommandIcon 
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
import { LogoSymbol } from '@/components/icons/LogoSymbol';

interface NavItemConfig {
  href: string;
  label: string;
  icon: ElementType; 
}

const mainNavItems: NavItemConfig[] = [
  { href: '/', label: 'Home', icon: HomeIcon },
  { href: '/loom-studio', label: 'Loom', icon: SettingsIcon },
  { href: '/aegis-security', label: 'Λegis', icon: ShieldIcon },
  { href: '/armory', label: 'Λrmory', icon: ShoppingCartIcon },
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
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const updateClock = () => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateClock();
    const timerId = setInterval(updateClock, 60000); 

    return () => clearInterval(timerId);
  }, [isMounted]);

  return (
    <TooltipProvider delayDuration={0}>
      <header className="sticky top-0 z-50 w-full topbar-custom-bg font-headline text-gray-800 dark:text-white">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Left Side: Logo and Navigation */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-2xl font-bold flex items-center">
              <LogoSymbol className="text-primary dark:text-white" />
            </Link>
            <nav className="hidden md:flex items-center space-x-1">
              {mainNavItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "hover:bg-primary/10 dark:hover:bg-white/5",
                      "text-gray-700 dark:text-white",
                      "hover:text-gray-900 dark:hover:text-neutral-100",
                      (pathname === item.href || (item.href === '/' && pathname.startsWith('/dashboard') && pathname.length <=1 ) || (item.href !== '/' && pathname.startsWith(item.href)) ) &&
                        "active-nav-link-dark font-semibold" 
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
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Command or Search..."
                className={cn(
                  "w-full h-9 pl-10 pr-4 border-input bg-input focus:ring-accent focus:border-accent",
                  "text-sm text-foreground",
                  "placeholder:text-muted-foreground"
                )}
                aria-label="Command or search input"
              />
            </div>
          </div>

          {/* Right Side: Controls & User Menu */}
          <div className="flex items-center space-x-1.5">
             <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="text-gray-700 dark:text-neutral-200 hover:bg-primary/10 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white w-9 h-9"
                  aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
                >
                  {isMounted && theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-700 dark:text-neutral-200 hover:bg-primary/10 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white w-9 h-9">
                  <BellIcon className="h-5 w-5" />
                  <span className="sr-only">Notifications</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom"><p>Notifications</p></TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-700 dark:text-neutral-200 hover:bg-primary/10 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white w-9 h-9">
                  <Settings2Icon className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom"><p>Settings</p></TooltipContent>
            </Tooltip>

            <div className="flex items-center text-sm text-muted-foreground px-2 h-9">
              <ClockIcon className="h-4 w-4 mr-1.5" />
              {isMounted ? currentTime : "--:--"}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 h-9 px-2.5 text-muted-foreground hover:bg-primary/10 dark:hover:bg-white/5 hover:text-foreground dark:hover:text-white">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="https://placehold.co/40x40.png" alt="User" data-ai-hint="user avatar" />
                    <AvatarFallback className="text-xs bg-primary/30 text-primary-foreground">U</AvatarFallback>
                  </Avatar>
                  <ChevronDownIcon className="h-4 w-4 opacity-80" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glassmorphism-panel border-border/30 dark:border-white/10">
                <DropdownMenuLabel className="font-headline text-primary dark:text-primary">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/20 dark:bg-white/5"/>
                <DropdownMenuItem className="hover:!bg-primary/10 dark:hover:!bg-white/5 focus:bg-accent focus:text-accent-foreground">Profile</DropdownMenuItem>
                <DropdownMenuItem className="hover:!bg-primary/10 dark:hover:!bg-white/5 focus:bg-accent focus:text-accent-foreground">Billing</DropdownMenuItem>
                <DropdownMenuItem className="hover:!bg-primary/10 dark:hover:!bg-white/5 focus:bg-accent focus:text-accent-foreground">Settings</DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/20 dark:bg-white/5"/>
                <DropdownMenuItem className="hover:!bg-primary/10 dark:hover:!bg-white/5 focus:bg-accent focus:text-accent-foreground">Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
};

export default TopBar;
