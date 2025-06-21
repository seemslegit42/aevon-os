
"use client";

import React, { Suspense, useState, useEffect, useCallback } from 'react';
import { Rnd } from 'react-rnd';
import MicroAppCard from '@/components/micro-app-card';
import { Skeleton } from '@/components/ui/skeleton';
import { PinIcon, XIcon, ClockIcon, RefreshCwIcon as LoaderCircleIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { useDashboardLayout } from '@/hooks/use-dashboard-layout';
import { ALL_CARD_CONFIGS, DEFAULT_ACTIVE_CARD_IDS, ALL_MICRO_APPS } from '@/config/dashboard-cards.config';
import CommandPalette from '@/components/command-palette';
import { useCommandPaletteStore } from '@/stores/command-palette.store';
import eventBus from '@/lib/event-bus';
import { useDashboardStore } from '@/stores/dashboard.store';
import { useMicroAppStore } from '@/stores/micro-app.store';

// Data for dynamic updates
const sampleFeedItems = [
    { task: 'System Integrity Check', status: 'success', details: 'All core modules passed verification.' },
    { task: 'AI Insight Generated', status: 'success', details: 'New efficiency pattern identified in Loom.' },
    { task: 'Authentication Failure', status: 'failure', details: 'Failed login attempt detected from new IP.' },
    { task: 'Market Data Sync', status: 'success', details: 'Pulled latest stock and market trends.' },
    { task: 'Agent Self-Correction', status: 'success', details: 'Aegis agent adapted to new data pattern.'},
];

const sampleAgentStatuses = [
    { status: 'Adapting', statusColor: 'text-primary-foreground', statusIcon: LoaderCircleIcon, isSpinning: true },
    { status: 'Learning', statusColor: 'text-primary-foreground', statusIcon: ClockIcon, isSpinning: false },
    { status: 'Executing', statusColor: 'text-chart-4', statusIcon: LoaderCircleIcon, isSpinning: true },
    { status: 'Idle', statusColor: 'text-muted-foreground', statusIcon: ClockIcon, isSpinning: false },
];


const Dashboard: React.FC = () => {
  const {
    activeCardIds,
    cardLayouts,
    isInitialized,
    updateCardLayout,
    handleBringToFront,
    handleRemoveCard,
    handleAddCard,
    handleResetLayout,
  } = useDashboardLayout(ALL_CARD_CONFIGS, DEFAULT_ACTIVE_CARD_IDS);

  const { isOpen: isCommandPaletteOpen, setOpen: setCommandPaletteOpen } = useCommandPaletteStore();
  const { setFocusedCardId } = useDashboardStore();
  const registerApps = useMicroAppStore(state => state.registerApps);
  
  const [liveFeedData, setLiveFeedData] = useState<any[]>([]);
  const [agentPresenceData, setAgentPresenceData] = useState<any[]>([]);

  useEffect(() => {
    registerApps(ALL_MICRO_APPS);
  }, [registerApps]);

  useEffect(() => {
    // Initialize state from config on mount
    const initialFeedConfig = ALL_CARD_CONFIGS.find(c => c.id === 'liveOrchestrationFeed');
    if (initialFeedConfig && initialFeedConfig.contentProps?.feedItems) {
      setLiveFeedData(initialFeedConfig.contentProps.feedItems);
    }
    
    const initialAgentConfig = ALL_CARD_CONFIGS.find(c => c.id === 'agentPresence');
    if (initialAgentConfig && initialAgentConfig.contentProps?.agents) {
      const agents = initialAgentConfig.contentProps.agents;
      setAgentPresenceData(agents);
      // Emit initial status
      const activeAgents = agents.filter((a: any) => a.isSpinning).length;
      eventBus.emit('agents:statusUpdate', { activeCount: activeAgents, totalCount: agents.length });
    }
    
    // Set up interval for live updates
    const intervalId = setInterval(() => {
      // Update Live Feed
      setLiveFeedData(prevItems => {
        const newItem = { 
            ...sampleFeedItems[Math.floor(Math.random() * sampleFeedItems.length)],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        const updatedItems = [newItem, ...prevItems];
        if (updatedItems.length > 10) updatedItems.pop(); // Keep list from getting too long
        return updatedItems;
      });
      
      // Update Agent Presence and emit status
      setAgentPresenceData(prevAgents => {
        const updatedAgents = prevAgents.map(agent => ({
            ...agent,
            ...sampleAgentStatuses[Math.floor(Math.random() * sampleAgentStatuses.length)]
        }));
        
        // Calculate active agents and emit event
        const activeAgents = updatedAgents.filter(a => a.isSpinning);
        eventBus.emit('agents:statusUpdate', {
            activeCount: activeAgents.length,
            totalCount: updatedAgents.length,
        });
        
        return updatedAgents;
      });

      // Periodically trigger a notification glow
      if (Math.random() > 0.8) { // Approx. every 25 seconds
        eventBus.emit('notification:new');
      }
      
    }, 5000); // Update every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  // Listen for focus requests from the event bus (e.g., from the TopBar)
  useEffect(() => {
    const focusPanel = (cardId: string) => {
      // If card is not active, add it. In all cases, bring it to front.
      if (!activeCardIds.includes(cardId)) {
        handleAddCard(cardId);
      } else {
        handleBringToFront(cardId);
      }
    };

    eventBus.on('panel:focus', focusPanel);
    return () => {
      eventBus.off('panel:focus', focusPanel);
    };
  }, [activeCardIds, handleAddCard, handleBringToFront]);

  // Listen for commands from the TopBar
  useEffect(() => {
    const handleCommand = (query: string) => {
      // Ensure BEEP panel is active and in front
      if (!activeCardIds.includes('beep')) {
        handleAddCard('beep');
      } else {
        handleBringToFront('beep');
      }
      
      // Give a slight delay to ensure the panel is ready before sending the query
      setTimeout(() => {
        eventBus.emit('beep:submitQuery', query);
      }, 100);
    };

    eventBus.on('command:submit', handleCommand);
    return () => {
      eventBus.off('command:submit', handleCommand);
    };
  }, [handleAddCard, activeCardIds, handleBringToFront]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If the click is on the direct background, clear the focus
    if (e.target === e.currentTarget) {
        setFocusedCardId(null);
    }
  };


  if (!isInitialized) {
    return (
        <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                    <Skeleton className="h-[125px] w-full rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                    </div>
                </div>
            ))}
        </div>
    );
  }

  // Map of dynamic props to inject into cards
  const dynamicCardProps: { [key: string]: any } = {
    liveOrchestrationFeed: { feedItems: liveFeedData },
    agentPresence: { agents: agentPresenceData },
  };

  return (
    <div className="h-full w-full relative" onClick={handleCanvasClick}>
      {cardLayouts
        .filter(layout => activeCardIds.includes(layout.id))
        .map(layout => {
          const cardConfig = ALL_CARD_CONFIGS.find(c => c.id === layout.id);
          if (!cardConfig) return null;

          const CardContent = cardConfig.content;
          const mergedProps = { ...cardConfig.contentProps, ...dynamicCardProps[cardConfig.id] };

          return (
            <Rnd
              key={cardConfig.id}
              size={{ width: layout.width, height: layout.height }}
              position={{ x: layout.x, y: layout.y }}
              onDragStart={() => handleBringToFront(cardConfig.id)}
              onDragStop={(e, d) => updateCardLayout(cardConfig.id, { x: d.x, y: d.y })}
              onResizeStart={() => handleBringToFront(cardConfig.id)}
              onResizeStop={(e, direction, ref, delta, position) => {
                updateCardLayout(
                  cardConfig.id,
                  position,
                  { width: ref.style.width, height: ref.style.height }
                );
              }}
              minWidth={cardConfig.minWidth}
              minHeight={cardConfig.minHeight}
              style={{ zIndex: layout.zIndex }}
              className="react-draggable"
              dragHandleClassName="drag-handle"
            >
              <MicroAppCard
                title={cardConfig.title}
                icon={cardConfig.icon}
                className={cardConfig.cardClassName}
                actions={
                  <>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <PinIcon className="w-4 h-4" />
                    </Button>
                    {cardConfig.isDismissible && (
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveCard(cardConfig.id)}>
                        <XIcon className="w-4 h-4" />
                      </Button>
                    )}
                  </>
                }
              >
                <Suspense fallback={<div className="p-4"><Skeleton className="h-full w-full" /></div>}>
                  <CardContent {...mergedProps} />
                </Suspense>
              </MicroAppCard>
            </Rnd>
          );
      })}
       <CommandPalette
        isOpen={isCommandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
        allPossibleCards={ALL_CARD_CONFIGS}
        activeCardIds={activeCardIds}
        cardLayouts={cardLayouts}
        onAddCard={handleAddCard}
        onRemoveCard={handleRemoveCard}
        onResetLayout={handleResetLayout}
      />
    </div>
  );
};

export default Dashboard;
