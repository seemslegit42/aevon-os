
"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BrainCircuitIcon } from '@/components/icons';
import { Skeleton } from '@/components/ui/skeleton';

const EDRSummaryPanel: React.FC = () => {
    return (
        <Card className="glassmorphism-panel h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-headline text-primary">
                    EDR Summary
                </CardTitle>
                <BrainCircuitIcon className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex-grow flex flex-col items-center justify-center text-center">
                <BrainCircuitIcon className="w-16 h-16 text-primary/30 mb-4" />
                <h3 className="text-lg font-semibold text-foreground">Coming Soon</h3>
                <p className="text-sm text-muted-foreground mt-1">
                    Get an overview of threats detected on your endpoints by the AI blocking engine.
                </p>
                 <div className="w-full mt-6 space-y-4">
                    <Skeleton className="h-6 w-1/2 mx-auto" />
                    <Skeleton className="h-32 w-full" />
                </div>
            </CardContent>
        </Card>
    );
};

export default EDRSummaryPanel;
