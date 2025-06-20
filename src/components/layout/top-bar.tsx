
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Bell, Home, Settings, Shield, ShoppingCart, Settings2, type LucideIcon, ChevronDown, LayoutGrid, Clock, BrainCircuit } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  showDropdown?: boolean;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Home Dashboard', icon: Home, showDropdown: true },
  // { href: '/loom-studio', label: 'Loom Studio', icon: Settings },
  // { href: '/aegis-security', label: 'Aegis Security', icon: Shield },
  // { href: '/armory', label: 'Armory', icon: ShoppingCart },
];

const TopBar: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format as HH:MM:SS AM/PM UTC
      let hours = now.getUTCHours();
      const minutes = now.getUTCMinutes();
      const seconds = now.getUTCSeconds();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // Handle midnight (0 hours)
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${ampm} UTC`;
    };
    
    setCurrentTime(updateTime()); 
    const timer = setInterval(() => {
      setCurrentTime(updateTime());
    }, 1000);
    return () => clearInterval(timer); 
  }, []);

  return (
    <TooltipProvider delayDuration={0}>
      <header className="sticky top-0 z-50 w-full topbar-custom-bg font-headline">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-2xl font-bold flex items-center">
              <BrainCircuit className="w-7 h-7 mr-2 text-primary" />
               <span className="text-accent">ΛΞVON OS</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} passHref legacyBehavior>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "text-muted-foreground hover:text-primary-foreground hover:bg-primary/20 dark:hover:bg-white/10",
                      (pathname === item.href || (item.href === '/' && pathname.startsWith('/dashboard'))) && "active-nav-link-dark font-semibold" 
                    )}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                    {item.showDropdown && <ChevronDown className="w-4 h-4 ml-1 opacity-70" />}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex-1 flex justify-center px-8 lg:px-16">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Command or Search (Ctrl+K)..."
                className="w-full h-9 pl-10 pr-16 bg-background/50 dark:bg-white/5 border-border/50 dark:border-white/20 text-sm text-foreground dark:text-primary-foreground placeholder-muted-foreground focus:ring-primary focus:border-primary"
                aria-label="Command or search input"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-muted/50 bg-muted/20 px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  ⌘K
                </kbd>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
             <Tooltip>
                <TooltipTrigger asChild>
                     <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary-foreground hover:bg-primary/20 dark:hover:bg-white/10" aria-label="Grid/App Menu">
                        <LayoutGrid className="w-5 h-5" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom"><p>App Launcher</p></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                 <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary-foreground hover:bg-primary/20 dark:hover:bg-white/10" aria-label="Time/Date Settings">
                  <Clock className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom"><p>Timezone & Date Settings</p></TooltipContent>
            </Tooltip>
            
            <div className="text-xs text-muted-foreground hidden sm:block w-[130px] text-center">{currentTime}</div>

            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-0 h-auto flex items-center space-x-2 text-muted-foreground hover:text-primary-foreground hover:bg-primary/20 dark:hover:bg-white/10" aria-label="User Menu">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/80 text-primary-foreground text-xs">ΛΞ</AvatarFallback>
                      </Avatar>
                      <div className="hidden lg:flex flex-col items-start text-xs">
                        {/* Removed static Admin User text */}
                      </div>
                       <ChevronDown className="w-4 h-4 opacity-70" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glassmorphism-panel w-56">
                    <DropdownMenuLabel className="font-normal">
                      <p className="text-sm font-medium leading-none text-foreground">User</p>
                      <p className="text-xs text-muted-foreground">Session: Active</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent side="bottom"><p>User Menu</p></TooltipContent>
            </Tooltip>
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
};

export default TopBar;
    
