
"use client";

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from '../ui/badge';
import { PlayIcon, EyeIcon, XIcon, TrashIcon, CopyIcon } from '../icons';
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

interface AppLauncherIconProps {
  app: MicroApp;
}

export const AppLauncherIcon: React.FC<AppLauncherIconProps> = ({ app }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
    const isLongPressTriggeredRef = useRef(false);

    // Get both state and actions directly from the store.
    // This makes the component's dependencies explicit.
    const { layoutItems, launchApp, cloneApp, focusLatestInstance, closeAllInstancesOfApp } = useLayoutStore(state => ({
        layoutItems: state.layoutItems,
        launchApp: state.launchApp,
        cloneApp: state.cloneApp,
        focusLatestInstance: state.focusLatestInstance,
        closeAllInstancesOfApp: state.closeAllInstancesOfApp
    }), shallow);
    
    const openInstances = layoutItems.filter(item => item.type === 'app' && item.appId === app.id);
    const isActive = openInstances.length > 0;
    const AppIcon = app.icon;

    const handleTouchStart = () => {
      isLongPressTriggeredRef.current = false;
      longPressTimerRef.current = setTimeout(() => {
        isLongPressTriggeredRef.current = true;
        setMenuOpen(true);
      }, 500); // 500ms for long press
    };

    const cancelLongPress = () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    };
    
    // This will handle both click and tap, launching the app directly.
    const handleClick = () => {
      if (isLongPressTriggeredRef.current) {
        return;
      }
      launchApp(app);
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setMenuOpen(true);
    };

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
                onClick={handleClick}
                onContextMenu={handleContextMenu}
                onTouchStart={handleTouchStart}
                onTouchEnd={cancelLongPress}
                onTouchMove={cancelLongPress}
                onMouseLeave={cancelLongPress}
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
                    <PlayIcon className="text-primary"/> {app.title}
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
                  <p className="text-xs text-muted-foreground mt-2 border-t border-border/20 pt-2">Left-click to launch, right-click for more options.</p>
              </div>
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent className="w-56 glassmorphism-panel" onClick={(e) => e.preventDefault()}>
          <DropdownMenuLabel>{app.title}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => { launchApp(app); setMenuOpen(false); }}>
            <PlayIcon />
            <span>Launch New Instance</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => { cloneApp(app.id); setMenuOpen(false); }} disabled={!isActive}>
            <CopyIcon />
            <span>Clone Latest Instance</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => { focusLatestInstance(app.id); setMenuOpen(false); }} disabled={!isActive}>
              <EyeIcon />
            <span>Focus Latest</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive focus:bg-destructive/10"
            onClick={() => { closeAllInstancesOfApp(app.id); setMenuOpen(false); }}
            disabled={!isActive}
          >
            <XIcon />
            <span>Close All Instances</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" disabled>
            <TrashIcon />
            <span>Remove from Launcher</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
};
