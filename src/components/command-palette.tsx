
"use client";
import React, { useState, useEffect, type ElementType } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircleIcon, Trash2Icon, SearchIcon, XIcon, GearIcon, RocketIcon, TargetIcon } from '@/components/icons';
import { ALL_CARD_CONFIGS } from '@/config/dashboard-cards.config';
import { useCommandPaletteStore } from '@/stores/command-palette.store';
import { useMicroApps } from '@/hooks/use-micro-apps';
import type { MicroApp } from '@/stores/micro-app.store';
import eventBus from '@/lib/event-bus';
import { useLayoutStore } from '@/stores/layout.store';

const CommandPalette: React.FC = () => {
  const { isOpen, setOpen } = useCommandPaletteStore();
  const { layoutItems } = useLayoutStore();
  const [searchTerm, setSearchTerm] = useState('');
  const allMicroApps = useMicroApps();
  const appMap = new Map(allMicroApps.map(app => [app.id, app]));

  const handleLaunchApp = (app: MicroApp) => {
    eventBus.emit('app:launch', app);
    setOpen(false); // Close palette after launching
  };

  const handleAddCard = (cardId: string) => {
      eventBus.emit('panel:add', cardId);
  }

  const handleCloseItem = (itemId: string) => {
      eventBus.emit('panel:remove', itemId);
  }
  
  const handleFocusItem = (itemId: string) => {
    eventBus.emit('panel:focus', itemId);
    setOpen(false);
  }

  const handleResetLayout = () => {
      eventBus.emit('layout:reset');
  }
  
  const activeCardIds = new Set(layoutItems.filter(i => i.type === 'card').map(i => i.cardId));

  const filteredCards = ALL_CARD_CONFIGS.filter(card =>
    !searchTerm ||
    card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredApps = allMicroApps.filter(app =>
    !searchTerm ||
    app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAppInstances = layoutItems.filter(item => 
      item.type === 'app' && 
      (!searchTerm || appMap.get(item.appId)?.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );


  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!isOpen);
      }
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isOpen, setOpen]);


  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] p-0 max-h-[80vh] flex flex-col">
        <DialogHeader className="p-4 border-b border-border/30">
          <DialogTitle className="font-headline text-primary flex items-center gap-2"><GearIcon /> Manage Workspace</DialogTitle>
          <DialogDescription>Add zones, launch micro-apps, or manage open windows.</DialogDescription>
        </DialogHeader>

        <div className="p-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search zones, apps, or open windows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-input border-input"
            />
             {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setSearchTerm('')}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              )}
          </div>
        </div>

        <ScrollArea className="flex-grow px-4 pb-4">
          <div className="space-y-3">
             <h4 className="text-sm font-semibold text-muted-foreground px-1 pt-2">Micro-Apps</h4>
             {filteredApps.map(app => {
              const AppIcon = app.icon;
              return (
                <div
                  key={app.id}
                  className="flex items-start justify-between p-3 rounded-md bg-card/70 dark:bg-card/80 hover:bg-primary/10 transition-colors"
                >
                  <div className="flex items-start space-x-3 flex-1 mr-4">
                    <AppIcon className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">{app.title}</span>
                      <p className="text-xs text-muted-foreground mt-1">{app.description}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLaunchApp(app)}
                      className="text-secondary border-secondary/50 hover:bg-secondary/10 hover:text-secondary w-[90px]"
                    >
                      <RocketIcon className="w-4 h-4 mr-2" />
                      Launch
                    </Button>
                  </div>
                </div>
              );
            })}
            {filteredApps.length === 0 && searchTerm && (
              <p className="text-sm text-muted-foreground text-center py-2">No micro-apps match your search.</p>
            )}

            <h4 className="text-sm font-semibold text-muted-foreground px-1 pt-4">Dashboard Zones</h4>
            {filteredCards.map(card => {
              const isActive = activeCardIds.has(card.id);
              const Icon = card.icon as ElementType;
              return (
                <div
                  key={card.id}
                  className="flex items-start justify-between p-3 rounded-md bg-card/70 dark:bg-card/80 hover:bg-primary/10 transition-colors"
                >
                  <div className="flex items-start space-x-3 flex-1 mr-4">
                    <Icon className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">{card.title}</span>
                      {card.description && (
                        <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {isActive ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCloseItem(card.id)}
                        className="text-destructive border-destructive/50 hover:bg-destructive/10 hover:text-destructive w-[90px]"
                      >
                        <Trash2Icon className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddCard(card.id)}
                        className="text-primary border-primary/50 hover:bg-primary/10 w-[90px]"
                      >
                        <PlusCircleIcon className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
             {filteredCards.length === 0 && searchTerm && (
              <p className="text-sm text-muted-foreground text-center py-2">No zones match your search.</p>
             )}
             
            {openAppInstances.length > 0 && (
                <>
                <h4 className="text-sm font-semibold text-muted-foreground px-1 pt-4">Open Windows</h4>
                {openAppInstances.map(item => {
                    const appConfig = appMap.get(item.appId);
                    if (!appConfig) return null;
                    const AppIcon = appConfig.icon;
                    return (
                        <div key={item.id} className="flex items-start justify-between p-3 rounded-md bg-card/70 dark:bg-card/80 hover:bg-primary/10 transition-colors">
                            <div className="flex items-start space-x-3 flex-1 mr-4">
                                <AppIcon className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-foreground">{appConfig.title}</span>
                                    <p className="text-xs text-muted-foreground mt-1 font-mono">ID: ...{item.id.slice(-6)}</p>
                                </div>
                            </div>
                            <div className="flex-shrink-0 flex items-center space-x-2">
                                <Button variant="outline" size="sm" onClick={() => handleFocusItem(item.id)}>
                                    <TargetIcon className="w-4 h-4 mr-2"/>
                                    Focus
                                </Button>
                                <Button variant="outline" size="icon" onClick={() => handleCloseItem(item.id)} className="text-destructive border-destructive/50 hover:bg-destructive/10 hover:text-destructive h-9 w-9">
                                    <XIcon className="w-4 h-4"/>
                                    <span className="sr-only">Close</span>
                                </Button>
                            </div>
                        </div>
                    );
                })}
                </>
            )}
            {searchTerm && openAppInstances.length === 0 && filteredCards.length === 0 && filteredApps.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No zones, apps, or open windows match your search.</p>
            )}
          </div>
        </ScrollArea>
        <DialogFooter className="p-4 border-t border-border/30">
          <Button variant="outline" onClick={handleResetLayout}>Reset Layout</Button>
          <Button onClick={() => setOpen(false)} className="bg-primary hover:bg-primary/90 text-primary-foreground">Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CommandPalette;
