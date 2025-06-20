
"use client";
import React, { type ElementType } from 'react';
import { Button } from '@/components/ui/button';
import { useApplicationViewStore } from '@/stores/application-view.store';
import { ScrollArea } from '../ui/scroll-area';

interface AppInfo {
  id: string;
  icon: ElementType;
  label: string;
}

interface MicroAppsCardContentProps {
  availableApps: AppInfo[];
}

const MicroAppsCardContent: React.FC<MicroAppsCardContentProps> = ({ availableApps = [] }) => {
  const setCurrentAppId = useApplicationViewStore(state => state.setCurrentAppId);

  return (
    <ScrollArea className="h-full pr-2">
        <div className="grid grid-cols-2 gap-3">
        {availableApps.map((app) => {
            const AppIcon = app.icon;
            return (
            <Button
                key={app.id}
                variant="outline"
                className="flex flex-col items-center justify-center h-20 p-2 space-y-1 bg-card/60 hover:bg-primary/10 border-border/50 hover:border-primary/50"
                onClick={() => setCurrentAppId(app.id)}
            >
                <AppIcon className="w-6 h-6 text-primary" />
                <span className="text-xs text-center text-muted-foreground">{app.label}</span>
            </Button>
            );
        })}
        {availableApps.length === 0 && (
             <div className="text-center py-6 col-span-2">
                <p className="text-sm text-muted-foreground">No micro-apps available.</p>
            </div>
        )}
        </div>
    </ScrollArea>
  );
};

export default MicroAppsCardContent;
