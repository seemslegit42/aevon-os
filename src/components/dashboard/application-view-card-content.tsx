
"use client";
import React from 'react';
import { AppWindowIcon } from '@/components/icons';
import { useApplicationViewStore } from '@/stores/application-view.store';

const ApplicationViewCardContent: React.FC = () => {
    const { currentAppId } = useApplicationViewStore();

    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <AppWindowIcon className="w-12 h-12 text-primary mb-3" />
            <h3 className="text-md font-headline text-primary-foreground mb-1">
                {currentAppId ? `Viewing: ${currentAppId}` : 'Active Micro-App'}
            </h3>
            <p className="text-xs text-muted-foreground">
                {currentAppId
                    ? `This panel shows the active micro-app. Data can be shared across other OS modules.`
                    : `Select a micro-app from the palette to launch it here. Active applications benefit from cross-app data synergy and adaptive AI insights.`
                }
            </p>
        </div>
    );
};

export default ApplicationViewCardContent;
