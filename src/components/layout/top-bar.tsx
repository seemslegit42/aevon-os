
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Search, Bell, Settings, Briefcase, Shield, ShoppingCart, Bot } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { generatePersonalizedBriefing, GeneratePersonalizedBriefingInput } from '@/ai/flows/generate-personalized-briefings';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const TopBar: React.FC = () => {
  const [beepInput, setBeepInput] = useState('');
  const [isBeepLoading, setIsBeepLoading] = useState(false);
  const [beepResponse, setBeepResponse] = useState<string | null>(null);
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState<string | null>(null);

  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleBeepSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!beepInput.trim()) return;

    setIsBeepLoading(true);
    setBeepResponse(null);

    try {
      // For demo, using fixed values for other inputs to generatePersonalizedBriefing
      const input: GeneratePersonalizedBriefingInput = {
        userName: "Valued User",
        operationalMetrics: "Sales are up 15% this quarter. Customer satisfaction is at 92%.",
        relevantInformation: `Query: "${beepInput}". System status is optimal. No critical alerts.`,
      };
      const result = await generatePersonalizedBriefing(input);
      setBeepResponse(result.briefing);
      toast({
        title: "BEEP Assistant",
        description: <p className="text-sm">{result.briefing.substring(0,150)}...</p>,
      });
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
      setBeepInput('');
    }
  };

  const navItems = [
    { href: "/", label: "Dashboard", icon: Briefcase },
    { href: "/loom-studio", label: "Loom Studio", icon: Settings },
    { href: "/aegis-security", label: "Aegis Security", icon: Shield },
    { href: "/armory", label: "ΛΞVON Λrmory", icon: ShoppingCart },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glassmorphism-panel shadow-lg font-headline">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary flex items-center animate-subtle-pulse">
          <Bot className="w-8 h-8 mr-2 text-primary" />
           ΛΞVON OS
        </Link>

        <nav className="hidden md:flex items-center space-x-2">
          {navItems.map((item) => (
            <Button key={item.label} variant="ghost" asChild className="text-foreground hover:text-accent hover:bg-accent/10">
              <Link href={item.href} className="flex items-center space-x-2 px-3 py-2">
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            </Button>
          ))}
        </nav>

        <div className="flex items-center space-x-3">
          <form onSubmit={handleBeepSubmit} className="hidden lg:flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Ask BEEP..."
              value={beepInput}
              onChange={(e) => setBeepInput(e.target.value)}
              className="w-64 h-10 bg-background/50 border-primary/50 focus:ring-accent"
              aria-label="BEEP command input"
            />
            <Button type="submit" size="icon" variant="ghost" className="text-primary hover:text-accent" disabled={isBeepLoading} aria-label="Submit to BEEP">
              <MessageSquare className={`w-5 h-5 ${isBeepLoading ? 'animate-spin' : ''}`} />
            </Button>
          </form>

          <Button variant="ghost" size="icon" className="text-foreground hover:text-accent" aria-label="Search">
            <Search className="w-5 h-5" />
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground hover:text-accent" aria-label="Notifications">
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
                {beepResponse && (
                  <div className="mt-2 p-3 bg-accent/10 rounded-md">
                    <h5 className="font-semibold text-accent font-headline">BEEP Response:</h5>
                    <p className="text-sm text-foreground">{beepResponse}</p>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
          
          <div className="text-sm text-muted-foreground hidden sm:block">{currentTime}</div>

          <Avatar>
            <AvatarImage src="https://placehold.co/40x40.png" alt="User Avatar" data-ai-hint="user avatar" />
            <AvatarFallback>ΛΟ</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
