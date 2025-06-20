
import React from 'react';
import { Blocks } from 'lucide-react';

const ApplicationViewCardContent: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <Blocks className="w-16 h-16 text-muted-foreground/50 mb-3" />
      <p className="text-sm text-muted-foreground">No micro-app launched.</p>
      <p className="text-xs text-muted-foreground/80">Select an app from the 'Micro-Apps' launcher.</p>
    </div>
  );
};

export default ApplicationViewCardContent;

    