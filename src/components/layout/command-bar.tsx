
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Search, BrainCircuit } from 'lucide-react';
import eventBus from '@/lib/event-bus';
import { useBeepChatStore } from '@/stores/beep-chat.store';

const CommandBar: React.FC = () => {
    const [commandValue, setCommandValue] = useState('');
    const [agentResponse, setAgentResponse] = useState<string | null>(null);

    const { avatarState, append, isLoading } = useBeepChatStore(state => ({ 
        avatarState: state.avatarState, 
        append: state.append,
        isLoading: state.isLoading
    }));

    useEffect(() => {
        const handleAgentResponse = (response: string) => {
            setAgentResponse(response);
            const timer = setTimeout(() => {
                setAgentResponse(null);
            }, 5000); // Display for 5 seconds
            return () => clearTimeout(timer);
        };

        eventBus.on('beep:response', handleAgentResponse);
        return () => {
            eventBus.off('beep:response', handleAgentResponse);
        };
    }, []);

    const handleCommandSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (commandValue.trim() && !isLoading) {
            append({ role: 'user', content: commandValue });
            setCommandValue('');
        }
    };
    
    // Map avatarState to a specific glow CSS class
    const glowClass = avatarState.startsWith('speaking') 
      ? `command-bar-glow-${avatarState}`
      : `command-bar-glow-${avatarState}`;

    return (
        <div className={cn("relative w-full max-w-md h-9 command-bar-container", glowClass)}>
            <AnimatePresence>
                {agentResponse ? (
                    <motion.div
                        key="agent-response"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 flex items-center gap-2 px-3 bg-primary/10 rounded-md"
                    >
                        <BrainCircuit className="h-4 w-4 text-primary flex-shrink-0" />
                        <p className="text-sm text-foreground truncate">{agentResponse}</p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="command-input"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0"
                    >
                        <form onSubmit={handleCommandSubmit} className="w-full h-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 aevos-icon-styling-override text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search or ask BEEP..."
                                className={cn(
                                    "command-bar-input-aevos-override w-full h-9 pl-10 pr-4 text-sm",
                                    isLoading && "opacity-50 cursor-not-allowed"
                                )}
                                aria-label="Command or search input"
                                value={commandValue}
                                onChange={(e) => setCommandValue(e.target.value)}
                                disabled={isLoading}
                            />
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CommandBar;
