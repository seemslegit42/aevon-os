
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { useMicroAppStore } from '@/stores/micro-app.store';
import { ScrollArea } from '../ui/scroll-area';
import eventBus from '@/lib/event-bus';


const MicroAppsCardContent: React.FC = () => {
  const apps = useMicroAppStore(state => state.apps);
  const activateApp = useMicroAppStore(state => state.activateApp);

  const handleLaunchApp = (appId: string) => {
    activateApp(appId);
    eventBus.emit('panel:focus', 'applicationView');
  };

  return (
    <ScrollArea className="h-full pr-2">
        <div className="grid grid-cols-2 gap-3">
        {apps.map((app) => {
            const AppIcon = app.icon;
            return (
            <Button
                key={app.id}
                variant="outline"
                className="flex flex-col items-center justify-center h-20 p-2 space-y-1 bg-card/60 hover:bg-primary/10 border-border/50 hover:border-primary/50"
                onClick={() => handleLaunchApp(app.id)}
            >
                <AppIcon className="w-6 h-6 text-primary" />
                <span className="text-xs text-center text-muted-foreground">{app.title}</span>
            </Button>
            );
        })}
        {apps.length === 0 && (
             <div className="text-center py-6 col-span-2">
                <p className="text-sm text-muted-foreground">No micro-apps available.</p>
            </div>
        )}
        </div>
    </ScrollArea>
  );
};

export default MicroAppsCardContent;
