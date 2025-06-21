
"use client";

import React, { Suspense, useState, useEffect } from 'react';
import { AppWindowIcon, XIcon } from '@/components/icons';
import { useMicroAppStore } from '@/stores/micro-app.store';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import eventBus from '@/lib/event-bus';

const ApplicationViewCardContent: React.FC = () => {
    const activeApps = useMicroAppStore(state => state.getActiveApps());
    const deactivateApp = useMicroAppStore(state => state.deactivateApp);
    const [selectedTab, setSelectedTab] = useState<string | undefined>(undefined);

    // Effect to manage the selected tab when apps are opened or closed
    useEffect(() => {
        // If there are active apps but no selected tab, select the last one (most recent)
        if (activeApps.length > 0 && !activeApps.some(app => app.id === selectedTab)) {
            setSelectedTab(activeApps[activeApps.length - 1].id);
        }
        // If there are no active apps, clear the selected tab
        else if (activeApps.length === 0) {
            setSelectedTab(undefined);
        }
    }, [activeApps, selectedTab]);

    // Effect to focus this panel when a new app is launched
    useEffect(() => {
        const handleAppLaunch = (appId: string) => {
            setSelectedTab(appId);
            eventBus.emit('panel:focus', 'applicationView');
        };
        // This is a simplified way to detect a new app launch.
        // A more robust system might use a dedicated event.
        const unSub = useMicroAppStore.subscribe(
            (state, prevState) => {
                const newActiveApps = state.getActiveApps();
                const oldActiveApps = prevState.getActiveApps();
                if (newActiveApps.length > oldActiveApps.length) {
                    const newApp = newActiveApps.find(app => !oldActiveApps.some(oldApp => oldApp.id === app.id));
                    if (newApp) {
                        handleAppLaunch(newApp.id);
                    }
                }
            }
        );
        return () => unSub();
    }, []);


    const handleCloseTab = (e: React.MouseEvent, appId: string) => {
        e.stopPropagation(); // Prevent the tab from being selected
        deactivateApp(appId);
    };

    if (activeApps.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <AppWindowIcon className="w-12 h-12 text-primary mb-3" />
                <h3 className="text-md font-headline text-primary-foreground mb-1">
                    Active Micro-App
                </h3>
                <p className="text-xs text-muted-foreground">
                    Select a micro-app from the palette (Cmd+K) to launch it here. Multiple apps can be opened in tabs.
                </p>
            </div>
        );
    }
    
    return (
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="h-full w-full flex flex-col">
            <TabsList className="flex-shrink-0 justify-start h-auto p-1 bg-transparent border-b border-border/30 rounded-none">
                {activeApps.map(app => {
                    const AppIcon = app.icon;
                    return (
                        <TabsTrigger 
                            key={app.id} 
                            value={app.id} 
                            className="flex-shrink-0 data-[state=active]:bg-primary/10 data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
                        >
                            <AppIcon className="w-4 h-4 mr-2" />
                            <span className="text-xs">{app.title}</span>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="w-5 h-5 ml-2"
                                onClick={(e) => handleCloseTab(e, app.id)}
                            >
                                <XIcon className="w-3 h-3" />
                            </Button>
                        </TabsTrigger>
                    );
                })}
            </TabsList>

            <div className="flex-grow min-h-0 relative">
                {activeApps.map(app => {
                    const AppToRender = app.component;
                    return (
                        <TabsContent key={app.id} value={app.id} className="h-full w-full m-0 p-2 absolute inset-0 focus-visible:ring-0">
                             <Suspense fallback={<Skeleton className="h-full w-full" />}>
                                <AppToRender />
                            </Suspense>
                        </TabsContent>
                    );
                })}
            </div>
        </Tabs>
    );
};

export default ApplicationViewCardContent;
