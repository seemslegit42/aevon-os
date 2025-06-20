
import React from 'react';
import { Blocks } from 'lucide-react'; // Using Blocks as per previous setup for generic app icon

const ApplicationViewCardContent: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <Blocks className="w-16 h-16 text-primary/50 mb-4" /> 
      <p className="text-sm text-foreground/90 font-medium">No micro-app launched.</p> 
      <p className="text-xs text-muted-foreground mt-1">Select an app from the 'Micro-Apps' launcher.</p>
    </div>
  );
};

export default ApplicationViewCardContent;
    