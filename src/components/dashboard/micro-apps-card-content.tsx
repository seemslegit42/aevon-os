
import React from 'react';
import { Button } from '@/components/ui/button';
import { BarChartBig, Settings2, Info, PackageSearch } from 'lucide-react'; // Added PackageSearch
import type { Emitter } from 'mitt';

interface MicroAppsCardContentProps {
  eventBusInstance?: Emitter<any>;
}

const MicroAppsCardContent: React.FC<MicroAppsCardContentProps> = ({ eventBusInstance }) => {
  // This component could emit events when an app is "launched"
  // e.g., eventBusInstance?.emit('app:launch', { appId: 'someApp' });

  return (
    <div className="grid grid-cols-3 gap-3 pt-1">
      {[
        {icon: BarChartBig, label: "Analytics"},
        {icon: Settings2, label: "Workflow"},
        {icon: PackageSearch, label: "Explorer"},
      ].map((app, index) => (
        <Button
          key={index}
          variant="outline"
          className="flex flex-col items-center justify-center h-[70px] p-2 border-primary/30 hover:bg-primary/10 text-primary focus:bg-primary/10 bg-card/30 dark:bg-black/20 dark:hover:bg-primary/20 rounded-md"
          onClick={() => {
            // Potentially open selected app in 'ApplicationViewCard'
            // eventBusInstance?.emit('app:requestView', { appId: app.label.toLowerCase() });
          }}
        >
          <app.icon className="w-6 h-6 mb-1 text-primary/80" />
          <span className="text-xs font-medium text-primary/90">{app.label}</span>
        </Button>
      ))}
    </div>
  );
};

export default MicroAppsCardContent;
