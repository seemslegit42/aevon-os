
"use client";

import React from 'react';
import { useLayoutStore } from '@/stores/layout.store';
import { shallow } from 'zustand/shallow';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { WindowContent } from './dashboard-window-content';
import MicroAppCard from './micro-app-card';
import { ALL_CARD_CONFIGS, ALL_MICRO_APPS } from '@/config/app-registry';

export const MobileDashboard: React.FC = () => {
    const { layoutItems } = useLayoutStore(
        (state) => ({ layoutItems: state.layoutItems }),
        shallow
    );

    // On mobile, we want a curated, logical order, not the free-form z-index order.
    const sortedItems = [...layoutItems].sort((a, b) => {
        const order = ['liveOrchestrationFeed', 'beep', 'aiInsights', 'agentPresence'];
        const indexA = a.cardId ? order.indexOf(a.cardId) : order.length;
        const indexB = b.cardId ? order.indexOf(b.cardId) : order.length;
        if(a.type === 'app') return 1; // Apps always go last
        if(b.type === 'app') return -1;
        return indexA - indexB;
    });

    return (
        <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
                {sortedItems.map(item => {
                    // Minimized windows are not shown on mobile
                    if (item.isMinimized) {
                        return null;
                    }
                    
                    const config = item.type === 'card'
                        ? ALL_CARD_CONFIGS.find(c => c.id === item.cardId)
                        : ALL_MICRO_APPS.find(a => a.id === item.appId);

                    if (!config) {
                        return (
                            <Card key={item.id} className="p-4 bg-destructive text-destructive-foreground">
                                <p>Error: Component config not found for "{item.cardId || item.appId}".</p>
                            </Card>
                        );
                    }

                    return (
                        // Render each item as a card in a single column
                        <div key={item.id}>
                            <MicroAppCard
                                title={config.title}
                                icon={config.icon}
                                actions={null} // No window controls (close/min/max) on mobile
                                controls={undefined}
                                className=""
                            >
                                <WindowContent itemId={item.id} />
                            </MicroAppCard>
                        </div>
                    );
                })}
            </div>
        </ScrollArea>
    );
};
