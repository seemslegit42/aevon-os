
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RocketIcon } from '@/components/icons';
import { useMicroApps } from '@/hooks/use-micro-apps';
import type { MicroApp } from '@/stores/micro-app.store';
import eventBus from '@/lib/event-bus';

const ArmoryCardContent: React.FC = () => {
  const apps = useMicroApps();
  const featuredApps = apps.slice(0, 1); // Example: first app is featured
  const otherApps = apps.slice(1);

  const handleLaunchApp = (app: MicroApp) => {
    eventBus.emit('app:launch', app);
  };

  const AppListing: React.FC<{ app: MicroApp, isFeatured?: boolean }> = ({ app }) => {
    const AppIcon = app.icon;
    return (
      <div className="glassmorphism-panel flex items-start gap-4 p-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
            <AppIcon className="w-7 h-7 text-primary" />
          </div>
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-foreground">{app.title}</h4>
          <p className="text-xs text-muted-foreground mt-1">{app.description}</p>
        </div>
        <div className="flex-shrink-0 self-center">
          <Button
            size="sm"
            onClick={() => handleLaunchApp(app)}
            className="btn-gradient-primary-secondary"
          >
            <RocketIcon className="w-4 h-4 mr-2" />
            Launch
          </Button>
        </div>
      </div>
    );
  };

  return (
    <ScrollArea className="h-full pr-3">
      <div className="space-y-6 p-1">
        {featuredApps.length > 0 && (
          <div>
            <h3 className="font-headline text-lg text-primary mb-3">Featured App</h3>
            <div className="space-y-4">
              {featuredApps.map(app => (
                <AppListing key={app.id} app={app} />
              ))}
            </div>
          </div>
        )}

        {otherApps.length > 0 && (
          <div>
            <h3 className="font-headline text-lg text-primary mt-6 mb-3">All Available Apps</h3>
            <div className="space-y-4">
              {otherApps.map(app => (
                <AppListing key={app.id} app={app} />
              ))}
            </div>
          </div>
        )}
        
        {apps.length === 0 && (
           <div className="text-center text-muted-foreground py-8 text-sm h-full flex items-center justify-center">
              <p>No micro-apps are available for your account.</p>
            </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default ArmoryCardContent;
