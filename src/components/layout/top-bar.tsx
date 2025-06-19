
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Search, Bell, Settings, Briefcase, Shield, ShoppingCart, Bot, Home, ChevronDown, Settings2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { generatePersonalizedBriefing, GeneratePersonalizedBriefingInput } from '@/ai/flows/generate-personalized-briefings';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TopBar: React.FC = () => {
  const [beepInput, setBeepInput] = useState('');
  const [isBeepLoading, setIsBeepLoading] = useState(false);
  const [beepResponse, setBeepResponse] = useState<string | null>(null);
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState<string | null>(null);

  useEffect(() => {
    const updateTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' UTC';
    setCurrentTime(updateTime());
    const timer = setInterval(() => {
      setCurrentTime(updateTime());
    }, 1000); 
    return () => clearInterval(timer);
  }, []);

  const handleBeepSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!beepInput.trim()) return;

    setIsBeepLoading(true);
    setBeepResponse(null);

    try {
      const input: GeneratePersonalizedBriefingInput = {
        userName: "Valued User",
        operationalMetrics: "System status normal.",
        relevantInformation: `User query: "${beepInput}". Provide a concise and helpful response.`,
      };
      const result = await generatePersonalizedBriefing(input);
      setBeepResponse(result.briefing);
    } catch (error) {
      console.error("Error calling BEEP AI:", error);
      toast({
        variant: "destructive",
        title: "BEEP Error",
        description: "Could not process your request.",
      });
      setBeepResponse("Sorry, I couldn't process that request.");
    } finally {
      setIsBeepLoading(false);
    }
  };

  const navItems = [
    { href: "/loom-studio", label: "Loom Studio", icon: Settings },
    { href: "/aegis-security", label: "Aegis Security", icon: Shield },
    { href: "/armory", label: "ΛΞVON Λrmory", icon: ShoppingCart },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/30 dark:border-border/50 font-headline">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-2xl font-bold text-primary flex items-center">
            <Bot className="w-7 h-7 mr-2 text-primary" />
             ΛΞVON OS
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-sm text-foreground hover:bg-accent/10 hover:text-accent-foreground px-3">
                <Home className="w-4 h-4 mr-2" />
                Home Dashboard
                <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-popover text-popover-foreground border-border/50">
              <DropdownMenuItem>Home Dashboard</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex-1 flex justify-center px-8 lg:px-16">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Command or Search (Ctrl+K)..."
              className="w-full h-9 pl-10 pr-16 bg-background/70 dark:bg-input border-border/50 text-sm"
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
           {navItems.map((item) => (
            <Button key={item.label} variant="ghost" size="icon" asChild className="text-muted-foreground hover:text-accent hover:bg-accent/10" title={item.label}>
              <Link href={item.href}>
                <item.icon className="w-5 h-5" />
              </Link>
            </Button>
          ))}

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent hover:bg-accent/10" aria-label="Notifications">
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

          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent hover:bg-accent/10" aria-label="Settings">
            <Settings2 className="w-5 h-5" />
          </Button>
          
          <div className="text-xs text-muted-foreground hidden sm:block w-24 text-center">{currentTime}</div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-0 h-auto">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://placehold.co/40x40.png" alt="User Avatar" data-ai-hint="user avatar purple" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">AU</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover text-popover-foreground border-border/50">
              <DropdownMenuItem className="flex flex-col items-start !text-muted-foreground cursor-default">
                <span className="font-semibold text-foreground">Admin User</span>
                <span className="text-xs">Session: Active</span>
              </DropdownMenuItem>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
