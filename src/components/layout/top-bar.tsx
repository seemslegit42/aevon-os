
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Bell, Bot, Home, Settings, Shield, ShoppingCart, Settings2, LucideIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
}

const navItems: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/loom-studio', label: 'Loom Studio', icon: Settings },
  { href: '/aegis-security', label: 'Aegis Security', icon: Shield },
  { href: '/armory', label: 'Armory', icon: ShoppingCart },
];

const TopBar: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getUTCHours();
      const minutes = now.getUTCMinutes();
      const seconds = now.getUTCSeconds();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${ampm} UTC`;
    };
    
    setCurrentTime(updateTime()); // Set initial time
    const timer = setInterval(() => {
      setCurrentTime(updateTime());
    }, 1000); // Update every second
    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  return (
    <TooltipProvider delayDuration={300}>
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/20 dark:border-border/30 font-headline">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-2xl font-bold text-primary flex items-center">
              <Bot className="w-7 h-7 mr-2 text-primary" />
               ΛΞVON OS
            </Link>
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} passHref legacyBehavior>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "text-foreground/70 hover:text-primary hover:bg-primary/10 dark:text-muted-foreground dark:hover:text-primary dark:hover:bg-primary/10",
                      pathname === item.href && "text-primary bg-primary/10 dark:text-primary dark:bg-primary/20 font-semibold"
                    )}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
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
                placeholder="Q Command or Search (Ctrl+K)..."
                className="w-full h-9 pl-10 pr-16 bg-background/70 dark:bg-input border-border/20 dark:border-border/30 text-sm"
                aria-label="Command or search input"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  ⌘K
                </kbd>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground/70 hover:text-primary hover:bg-primary/10 dark:text-muted-foreground dark:hover:text-primary dark:hover:bg-primary/10" aria-label="Notifications">
                  <Bell className="w-5 h-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 glassmorphism-panel">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none font-headline text-primary">Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      You have no new notifications.
                    </p>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground/70 hover:text-primary hover:bg-primary/10 dark:text-muted-foreground dark:hover:text-primary dark:hover:bg-primary/10" aria-label="Settings">
                  <Settings2 className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
            
            <div className="text-xs text-muted-foreground hidden sm:block w-28 text-center">{currentTime}</div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0 h-auto">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://placehold.co/40x40.png" alt="User Avatar" data-ai-hint="user avatar purple" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">AU</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover text-popover-foreground border-border/20 dark:border-border/30 w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-foreground">Admin User</p>
                    <p className="text-xs leading-none text-muted-foreground">Session: Active</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
};

export default TopBar;
