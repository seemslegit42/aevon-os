
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { SearchIcon, AIBrainIcon } from '@/components/icons';
import eventBus from '@/lib/event-bus';

const CommandBar: React.FC = () => {
    const [commandValue, setCommandValue] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [agentResponse, setAgentResponse] = useState<string | null>(null);

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

    const handleCommandSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && commandValue.trim() && !isSubmitting) {
            e.preventDefault();
            eventBus.emit('beep:submitQuery', commandValue);
            setIsSubmitting(true);
            setTimeout(() => {
                setCommandValue('');
                setIsSubmitting(false);
            }, 2000);
        }
    };

    return (
        <div className="relative w-full max-w-md h-9">
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
                        <AIBrainIcon className="h-4 w-4 text-primary flex-shrink-0" />
                        <p className="text-sm text-primary-foreground truncate">{agentResponse}</p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="command-input"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0"
                    >
                         <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 aevos-icon-styling-override text-primary-foreground" />
                        <Input
                            type="search"
                            placeholder="Search or ask BEEP..."
                            className={cn(
                                "command-bar-input-aevos-override w-full h-9 pl-10 pr-4 text-sm",
                                isSubmitting && "opacity-50 cursor-not-allowed"
                            )}
                            aria-label="Command or search input"
                            value={commandValue}
                            onChange={(e) => setCommandValue(e.target.value)}
                            onKeyDown={handleCommandSubmit}
                            disabled={isSubmitting}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CommandBar;
