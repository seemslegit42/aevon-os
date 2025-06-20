
import React, { type ElementType } from 'react'; 
import { Button } from '@/components/ui/button';

import type { Emitter } from 'mitt';


export interface MicroAppItem {
  id: string; 
  icon: ElementType; 
  label: string;
}

interface MicroAppsCardContentProps {
  availableApps: MicroAppItem[];
  eventBusInstance?: Emitter<any>;
}

const MicroAppsCardContent: React.FC<MicroAppsCardContentProps> = ({ availableApps, eventBusInstance }) => {
  const handleAppLaunch = (appId: string) => {
    eventBusInstance?.emit('app:launch', { appId });
  };

  if (!availableApps || availableApps.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <p className="text-sm text-muted-foreground dark:text-muted-foreground">No micro-apps available to launch.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3 pt-1">
      {availableApps.map((app) => {
        const IconComponent = app.icon; 
        return (
          <Button
            key={app.id}
            variant="outline"
            className="flex flex-col items-center justify-center h-[70px] p-2 border-primary/30 hover:bg-primary/10 text-primary dark:text-primary focus:bg-primary/10 bg-card/50 dark:bg-card/50 dark:hover:bg-primary/20 rounded-md"
            onClick={() => handleAppLaunch(app.label)} 
          >
            <IconComponent className="w-6 h-6 mb-1 text-primary/80" />
            <span className="text-xs font-medium text-primary/90 dark:text-primary/90">{app.label}</span>
          </Button>
        );
      })}
    </div>
  );
};

export default MicroAppsCardContent;
