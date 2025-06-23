
"use client";

import React from 'react';
import { ScrollArea } from '../../components/ui/scroll-area';
import { useMicroApps } from '@/hooks/use-micro-apps';
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLauncherIcon } from './app-launcher-icon';

const MicroAppsCardContent: React.FC = () => {
  const apps = useMicroApps();
  
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
