
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';
import { useMicroApps } from '@/hooks/use-micro-apps';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from '../ui/badge';
import { RocketIcon, TargetIcon, XIcon } from '../icons';
import eventBus from '@/lib/event-bus';
import type { MicroApp } from '@/stores/micro-app.store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLayoutStore } from '@/stores/layout.store';
import { shallow } from 'zustand/shallow';

const MicroAppsCardContent: React.FC = () => {
  const { layoutItems, closeItem } = useLayoutStore(state => ({
    layoutItems: state.layoutItems,
    closeItem: state.closeItem,
  }), shallow);
  const apps = useMicroApps();
  
  const handleLaunch = (app: MicroApp) => {
    eventBus.emit('app:launch', app);
  }

  const handleCloseAllInstances = (appId: string) => {
    const instancesToClose = layoutItems.filter(item => item.type === 'app' && item.appId === appId);
    instancesToClose.forEach(instance => closeItem(instance.id));
  };

  const handleFocusLatestInstance = (appId: string) => {
      const instances = layoutItems.filter(item => item.type === 'app' && item.appId === appId);
      if (instances.length > 0) {
          const latestInstance = instances.reduce((latest, current) => (current.zIndex > latest.zIndex ? current : latest));
          eventBus.emit('panel:focus', latestInstance.id);
      }
  };

  // Helper component for each menu item to avoid re-creating state logic in a loop
  const AppLauncherIcon: React.FC<{app: MicroApp}> = ({ app }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const openInstances = layoutItems.filter(item => item.type === 'app' && item.appId === app.id);
    const isActive = openInstances.length > 0;
    const AppIcon = app.icon;

    return (
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <Tooltip>
          <DropdownMenuTrigger asChild>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "relative flex flex-col items-center justify-center h-20 p-2 space-y-1 bg-card/60 hover:bg-primary/10 border-border/50 hover:border-primary/50 transition-all",
                  isActive && "border-secondary/60 ring-1 ring-secondary/50"
                )}
                onClick={() => handleLaunch(app)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setMenuOpen(true);
                }}
              >
                {isActive && (
                    <div className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
                    </div>
                )}
                <AppIcon className="w-6 h-6 text-primary" />
                <span className="text-xs text-center text-muted-foreground">{app.title}</span>
              </Button>
            </TooltipTrigger>
          </DropdownMenuTrigger>
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
                  <p className="text-xs text-muted-foreground mt-2 border-t border-border/20 pt-2">Right-click for more options.</p>
              </div>
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent className="w-56 glassmorphism-panel" onClick={(e) => e.preventDefault()}>
          <DropdownMenuLabel>{app.title}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => { handleLaunch(app); setMenuOpen(false); }}>
            <RocketIcon />
            <span>Clone Instance</span>
          </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { handleFocusLatestInstance(app.id); setMenuOpen(false); }} disabled={!isActive}>
              <TargetIcon />
            <span>Focus Latest</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive focus:bg-destructive/10"
            onClick={() => { handleCloseAllInstances(app.id); setMenuOpen(false); }}
            disabled={!isActive}
          >
            <XIcon />
            <span>Close All Instances</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <TooltipProvider delayDuration={300}>
      <ScrollArea className="h-full pr-2">
        <div className="grid grid-cols-2 gap-3">
          {apps.map((app) => (
            <AppLauncherIcon key={app.id} app={app} />
          ))}
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
