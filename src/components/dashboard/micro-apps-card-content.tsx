
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { useMicroAppStore } from '@/stores/micro-app.store';
import { ScrollArea } from '../ui/scroll-area';
import eventBus from '@/lib/event-bus';
import { cn } from '@/lib/utils';
import { useMicroApps } from '@/hooks/use-micro-apps';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from '../ui/badge';
import { RocketIcon } from '../icons';

const MicroAppsCardContent: React.FC = () => {
  const { activateApp } = useMicroAppStore();
  const apps = useMicroApps();

  const handleLaunchApp = (appId: string) => {
    activateApp(appId);
    eventBus.emit('panel:focus', 'applicationView');
  };

  return (
    <TooltipProvider delayDuration={300}>
      <ScrollArea className="h-full pr-2">
        <div className="grid grid-cols-2 gap-3">
          {apps.map((app) => {
            const AppIcon = app.icon;
            return (
              <Tooltip key={app.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "relative flex flex-col items-center justify-center h-20 p-2 space-y-1 bg-card/60 hover:bg-primary/10 border-border/50 hover:border-primary/50 transition-all",
                      app.isActive && "border-secondary/60 ring-1 ring-secondary/50"
                    )}
                    onClick={() => handleLaunchApp(app.id)}
                  >
                    {app.isActive && (
                      <div className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
                      </div>
                    )}
                    <AppIcon className="w-6 h-6 text-primary" />
                    <span className="text-xs text-center text-muted-foreground">{app.title}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="w-64 glassmorphism-panel">
                    <div className="font-sans p-1 space-y-1.5">
                        <h4 className="font-semibold text-foreground flex items-center gap-2">
                           <RocketIcon className="text-primary"/> {app.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">{app.description}</p>
                        {app.tags && app.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-2">
                                {app.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs capitalize bg-secondary/20 text-secondary-foreground border-none">
                                    {tag}
                                </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
          {apps.length === 0 && (
            <div className="text-center py-6 col-span-2">
              <p className="text-sm text-muted-foreground">No micro-apps available for your account.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </TooltipProvider>
  );
};

export default MicroAppsCardContent;
