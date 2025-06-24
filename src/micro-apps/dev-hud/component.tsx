"use client";

import React from 'react';
import { useLayoutStore } from '@/stores/layout.store';
import { useMicroAppStore } from '@/stores/micro-app.store';
import { shallow } from 'zustand/shallow';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowClockwise, X } from 'phosphor-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ALL_MICRO_APPS } from '@/config/app-registry';

const DevHudCardContent: React.FC = () => {
    const { layoutItems, reloadApp, closeItem } = useLayoutStore(
        (state) => ({
            layoutItems: state.layoutItems,
            reloadApp: state.reloadApp,
            closeItem: state.closeItem,
        }),
        shallow
    );

    const appMap = React.useMemo(() => new Map(ALL_MICRO_APPS.map(app => [app.id, app])), []);

    const mountedApps = layoutItems.filter(item => item.type === 'app');
    const mountedCards = layoutItems.filter(item => item.type === 'card');

    return (
        <div className="h-full flex flex-col p-2 space-y-2">
            <ScrollArea className="flex-grow pr-2">
                <div className="space-y-4">
                    {/* Mounted Micro-Apps Section */}
                    <div>
                        <h4 className="text-sm font-headline text-primary mb-2">Mounted Micro-Apps ({mountedApps.length})</h4>
                        {mountedApps.length > 0 ? (
                            <div className="space-y-2">
                                {mountedApps.map(item => {
                                    const appInfo = item.appId ? appMap.get(item.appId) : null;
                                    return (
                                        <Card key={item.id} className="p-2 bg-card/50">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1 overflow-hidden">
                                                    <p className="font-semibold text-xs truncate">{appInfo?.title || 'Unknown App'}</p>
                                                    <p className="text-xs text-muted-foreground font-mono truncate">ID: {item.id}</p>
                                                </div>
                                                <div className="flex items-center gap-1.5 ml-2">
                                                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => reloadApp(item.id)}>
                                                        <ArrowClockwise weight="bold" />
                                                    </Button>
                                                    <Button variant="destructive" size="icon" className="h-7 w-7" onClick={() => closeItem(item.id)}>
                                                        <X weight="bold" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-xs text-muted-foreground text-center py-2">No micro-apps currently mounted.</p>
                        )}
                    </div>
                    
                    {/* Mounted Cards Section */}
                    <div>
                        <h4 className="text-sm font-headline text-primary mb-2">Mounted Cards ({mountedCards.length})</h4>
                        {mountedCards.length > 0 ? (
                            <div className="space-y-2">
                                {mountedCards.map(item => (
                                     <Card key={item.id} className="p-2 bg-card/50">
                                        <p className="font-semibold text-xs truncate">{item.cardId}</p>
                                        <p className="text-xs text-muted-foreground font-mono truncate">ID: {item.id}</p>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                             <p className="text-xs text-muted-foreground text-center py-2">No cards currently mounted.</p>
                        )}
                    </div>
                </div>
            </ScrollArea>
            
            {/* Zustand Store State Viewer */}
            <div className="flex-shrink-0">
                 <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="text-sm font-headline text-primary">
                            View Live Zustand Store State
                        </AccordionTrigger>
                        <AccordionContent>
                           <ScrollArea className="h-48 bg-background/50 p-2 rounded-md">
                                <pre className="text-xs whitespace-pre-wrap">
                                    {JSON.stringify({ layoutItems }, null, 2)}
                                </pre>
                           </ScrollArea>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
};

export default DevHudCardContent;
