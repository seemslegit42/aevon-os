
import React from 'react';
import { Button } from '@/components/ui/button';
import { BarChartBig, Settings2, Info } from 'lucide-react';

const MicroAppsCardContent: React.FC = () => {
  return (
    <div className="grid grid-cols-3 gap-3 pt-1">
      {[
        {icon: BarChartBig, label: "Launch"},
        {icon: Settings2, label: "Launch"},
        {icon: Info, label: "Launch"}, 
      ].map((app, index) => (
        <Button 
          key={index} 
          variant="outline" 
          className="flex flex-col items-center justify-center h-20 p-2 border-primary/50 hover:bg-primary/10 text-primary focus:bg-primary/10"
        >
          <app.icon className="w-7 h-7 mb-1" />
          <span className="text-xs">{app.label}</span>
        </Button>
      ))}
    </div>
  );
};

export default MicroAppsCardContent;

    