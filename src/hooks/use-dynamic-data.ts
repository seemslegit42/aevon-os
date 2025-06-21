
'use client';

import { useState, useEffect } from 'react';
import { ALL_CARD_CONFIGS } from '@/config/dashboard-cards.config';
import eventBus from '@/lib/event-bus';
import { ClockIcon, RefreshCwIcon as LoaderCircleIcon } from '@/components/icons';

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

export function useDynamicData() {
  const [liveFeedData, setLiveFeedData] = useState<any[]>([]);
  const [agentPresenceData, setAgentPresenceData] = useState<any[]>([]);

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
        setTimeout(() => {
            eventBus.emit('agents:statusUpdate', {
                activeCount: activeAgents.length,
                totalCount: updatedAgents.length,
            });
        }, 0);
        
        return updatedAgents;
      });

      // Periodically trigger a notification glow
      if (Math.random() > 0.8) { // Approx. every 25 seconds
        eventBus.emit('notification:new');
      }
      
    }, 5000); // Update every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  return { liveFeedData, agentPresenceData };
}
