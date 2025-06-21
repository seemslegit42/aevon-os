
"use client";
import React, { Suspense } from 'react';
import { AppWindowIcon } from '@/components/icons';
import { useApplicationViewStore } from '@/stores/application-view.store';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load the micro-app to keep initial bundle size small
const SalesAnalyticsApp = React.lazy(() => import('@/components/dashboard/micro-apps/sales-analytics-app'));

const ApplicationViewCardContent: React.FC = () => {
    const { currentAppId } = useApplicationViewStore();

    const renderContent = () => {
        if (!currentAppId) {
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

        switch (currentAppId) {
            case 'app-analytics':
                return (
                    <Suspense fallback={<Skeleton className="h-full w-full" />}>
                        <SalesAnalyticsApp />
                    </Suspense>
                );
            default:
                return (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                        <AppWindowIcon className="w-12 h-12 text-destructive mb-3" />
                        <h3 className="text-md font-headline text-destructive mb-1">
                            App Not Found
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            The application with ID "{currentAppId}" could not be loaded.
                        </p>
                    </div>
                );
        }
    };

    return (
        <div className="h-full w-full">
            {renderContent()}
        </div>
    );
};

export default ApplicationViewCardContent;
