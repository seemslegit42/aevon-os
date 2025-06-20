
import React, { useEffect, type ElementType } from 'react'; 
import { LayersIcon as BlocksIcon, PlusCircleIcon } from '@/components/icons'; 
import type { Emitter } from 'mitt';
import { useApplicationViewStore } from '@/stores/application-view.store';
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';

interface ApplicationViewCardContentProps {
  eventBusInstance?: Emitter<any>;
  setIsCommandPaletteOpen?: (isOpen: boolean) => void;
}

const ApplicationViewCardContent: React.FC<ApplicationViewCardContentProps> = ({ eventBusInstance, setIsCommandPaletteOpen }) => {
  const currentAppId = useApplicationViewStore((state) => state.currentAppId);
  const setCurrentAppId = useApplicationViewStore((state) => state.setCurrentAppId);

  useEffect(() => {
    const handleAppLaunch = (payload: { appId: string } | any) => {
        if(payload && typeof payload.appId === 'string') {
            setCurrentAppId(payload.appId);
        }
    };
    eventBusInstance?.on('app:launch', handleAppLaunch);
    return () => {
      eventBusInstance?.off('app:launch', handleAppLaunch);
    };
  }, [eventBusInstance, setCurrentAppId]);

  if (!currentAppId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <BlocksIcon className="w-16 h-16 text-primary/50 mb-4" />
        <p className="text-sm font-medium text-foreground/90">No micro-app launched.</p>
        <p className="text-xs text-muted-foreground mt-1 mb-3">Select an app from 'Micro-Apps' or the Command Palette.</p>
        {setIsCommandPaletteOpen && (
          <Button 
            variant="link" 
            onClick={() => setIsCommandPaletteOpen(true)}
            className="text-sm text-primary hover:text-primary/80 px-2 py-1 h-auto"
          >
            <PlusCircleIcon className="w-4 h-4 mr-1.5" />
            Launch Micro-App
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <h3 className={cn("text-lg font-headline text-primary")}>{currentAppId}</h3>
      <p className="text-sm text-muted-foreground">Content for {currentAppId} would load here.</p>
    </div>
  );
};

export default ApplicationViewCardContent;
