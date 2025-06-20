
import React, { useEffect } from 'react';
import { Blocks } from 'lucide-react';
import type { Emitter } from 'mitt';
import { useApplicationViewStore } from '@/stores/application-view.store';

interface ApplicationViewCardContentProps {
  eventBusInstance?: Emitter<any>;
}

const ApplicationViewCardContent: React.FC<ApplicationViewCardContentProps> = ({ eventBusInstance }) => {
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
        <Blocks className="w-16 h-16 text-primary/50 dark:text-white/80 mb-4" />
        <p className="text-sm text-foreground/90 dark:text-white font-medium">No micro-app launched.</p>
        <p className="text-xs text-muted-foreground dark:text-neutral-300 mt-1">Select an app from 'Micro-Apps' or Command Palette.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      {/* This would be where the actual Micro-App UI for 'currentAppId' renders */}
      <h3 className="text-lg font-semibold text-primary dark:text-white">{currentAppId}</h3>
      <p className="text-sm text-muted-foreground dark:text-neutral-300">Content for {currentAppId} would load here.</p>
      {/* Example: <SpecificAppUI appId={currentAppId} /> */}
    </div>
  );
};

export default ApplicationViewCardContent;
