
"use client";

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const LoomStudioPage: React.FC = () => {
    return (
        <div className="h-full w-full p-4 md:p-8">
            <h1 className="text-3xl font-bold font-headline text-primary mb-2">Loom Studio</h1>
            <p className="text-muted-foreground mb-6">Design, test, and orchestrate complex AI agent workflows visually.</p>
            <div className="h-[calc(100%-80px)] w-full">
                <Skeleton className="w-full h-full" />
                <p className="text-center text-muted-foreground mt-4">Loom Studio content will be loaded here.</p>
            </div>
        </div>
    );
};

export default LoomStudioPage;
