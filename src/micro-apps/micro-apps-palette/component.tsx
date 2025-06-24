
"use client";

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMicroApps } from '@/hooks/use-micro-apps';
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLauncherIcon } from '@/components/micro-apps/app-launcher-icon';

const MicroAppsCardContent: React.FC = () => {
  const apps = useMicroApps();
  
  return (
    <TooltipProvider delayDuration={300}>
      <ScrollArea className="h-full">
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {apps.map((app) => (
            <AppLauncherIcon key={app.id} app={app} />
          ))}
          {apps.length === 0 && (
            <div className="text-center py-6 col-span-full">
              <p className="text-sm text-muted-foreground">No micro-apps available for your account.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </TooltipProvider>
  );
};

export default MicroAppsCardContent;
