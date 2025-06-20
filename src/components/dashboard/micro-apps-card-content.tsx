
import React from 'react';
import { Button } from '@/components/ui/button';
import { BarChartBig, Settings2, Shield } from 'lucide-react';

const MicroAppsCardContent: React.FC = () => {
  return (
    <div className="grid grid-cols-3 gap-3 pt-1">
      {[
        {icon: BarChartBig, label: "Analytics"},
        {icon: Settings2, label: "Workflow"},
        {icon: Shield, label: "Security"},
      ].map((app, index) => (
        <Button key={index} variant="outline" className="flex flex-col items-center justify-center h-20 p-2 border-primary/20 hover:bg-primary/10">
          <app.icon className="w-7 h-7 text-primary mb-1" />
          <span className="text-xs text-primary truncate">Launch</span>
        </Button>
      ))}
    </div>
  );
};

export default MicroAppsCardContent;

    