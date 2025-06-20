
import React from 'react';
import { Button } from '@/components/ui/button';
import { BarChartBig, Settings2, Shield, Info } from 'lucide-react'; // Added Info icon as per image

const MicroAppsCardContent: React.FC = () => {
  return (
    <div className="grid grid-cols-3 gap-3 pt-1">
      {[
        // Icons and labels adjusted to match image (Launch text is implicit)
        {icon: BarChartBig, label: "Launch"}, // Original, matches Analytics-like icon
        {icon: Settings2, label: "Launch"}, // Original, matches Workflow-like icon
        {icon: Info, label: "Launch"}, // Changed Shield to Info to match image
      ].map((app, index) => (
        <Button 
          key={index} 
          variant="outline" 
          // Styling to match image: light purple border, icon, and text
          className="flex flex-col items-center justify-center h-20 p-2 border-primary/50 hover:bg-primary/10 text-primary focus:bg-primary/10"
        >
          <app.icon className="w-7 h-7 mb-1" /> {/* Text color handled by parent text-primary */}
          <span className="text-xs">{app.label}</span> {/* Text color handled by parent text-primary */}
        </Button>
      ))}
    </div>
  );
};

export default MicroAppsCardContent;
