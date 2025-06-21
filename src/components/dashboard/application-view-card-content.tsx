
"use client";

import React, { Suspense } from 'react';
import { AppWindowIcon } from '@/components/icons';
import { useMicroAppStore } from '@/stores/micro-app.store';
import { Skeleton } from '@/components/ui/skeleton';

const ApplicationViewCardContent: React.FC = () => {
    const activeApp = useMicroAppStore(state => state.getActiveApp());

    const renderContent = () => {
        if (!activeApp) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <AppWindowIcon className="w-12 h-12 text-primary mb-3" />
                    <h3 className="text-md font-headline text-primary-foreground mb-1">
                        Active Micro-App
                    </h3>
                    <p className="text-xs text-muted-foreground">
                        Select a micro-app from the palette to launch it here. Active applications benefit from cross-app data synergy and adaptive AI insights.
                    </p>
                </div>
            );
        }
        
        const AppToRender = activeApp.component;
        return (
             <Suspense fallback={<Skeleton className="h-full w-full" />}>
                <AppToRender />
            </Suspense>
        );
    };

    return (
        <div className="h-full w-full">
            {renderContent()}
        </div>
    );
};

export default ApplicationViewCardContent;
