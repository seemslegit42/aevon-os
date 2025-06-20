
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { BarChartBig, Settings2, PackageSearch, type LucideIcon } from 'lucide-react';
import type { Emitter } from 'mitt';
import { useMicroAppsStore } from '@/stores/micro-apps.store';

// Define the structure for an app item, now managed by the store
interface MicroAppItem {
  id: string; // Unique ID for the app
  icon: LucideIcon;
  label: string;
}

// Initial static list of apps, will be used to initialize the store
const initialAppItems: MicroAppItem[] = [
  {id: "analytics", icon: BarChartBig, label: "Analytics"},
  {id: "workflow", icon: Settings2, label: "Workflow"},
  {id: "explorer", icon: PackageSearch, label: "Explorer"},
];

interface MicroAppsCardContentProps {
  eventBusInstance?: Emitter<any>;
}

const MicroAppsCardContent: React.FC<MicroAppsCardContentProps> = ({ eventBusInstance }) => {
  const availableApps = useMicroAppsStore((state) => state.availableApps);
  const initializeApps = useMicroAppsStore((state) => state.initializeApps);

  useEffect(() => {
    initializeApps(initialAppItems);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Initialize once on mount

  const handleAppLaunch = (appId: string) => {
    // Emit an event that the ApplicationViewCardContent can listen to
    eventBusInstance?.emit('app:launch', { appId });
  };

  return (
    <div className="grid grid-cols-3 gap-3 pt-1">
      {availableApps.map((app) => (
        <Button
          key={app.id}
          variant="outline"
          className="flex flex-col items-center justify-center h-[70px] p-2 border-primary/30 hover:bg-primary/10 text-primary focus:bg-primary/10 bg-card/30 dark:bg-black/20 dark:hover:bg-primary/20 rounded-md"
          onClick={() => handleAppLaunch(app.label)} // Using label as ID for simplicity, could be app.id
        >
          <app.icon className="w-6 h-6 mb-1 text-primary/80" />
          <span className="text-xs font-medium text-primary/90">{app.label}</span>
        </Button>
      ))}
    </div>
  );
};

export default MicroAppsCardContent;
