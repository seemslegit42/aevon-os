
import React from 'react';
import { Button } from '@/components/ui/button';
import { BarChartBig, Settings2, Info } from 'lucide-react';

const MicroAppsCardContent: React.FC = () => {
  return (
    <div className="grid grid-cols-3 gap-3 pt-1">
      {[
        {icon: BarChartBig, label: "Launch"}, // Placeholder, actual icons would differ
        {icon: Settings2, label: "Launch"},
        {icon: Info, label: "Launch"}, 
      ].map((app, index) => (
        <Button 
          key={index} 
          variant="outline" 
          className="flex flex-col items-center justify-center h-[70px] p-2 border-primary/30 hover:bg-primary/10 text-primary focus:bg-primary/10 bg-card/30 dark:bg-black/20 dark:hover:bg-primary/20 rounded-md"
        >
          <app.icon className="w-6 h-6 mb-1 text-primary/80" />
          <span className="text-xs font-medium text-primary/90">{app.label}</span>
        </Button>
      ))}
    </div>
  );
};

export default MicroAppsCardContent;
    