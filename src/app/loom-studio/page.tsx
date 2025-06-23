
"use client";

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { PanInfo } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from "@/hooks/use-toast";
import eventBus from '@/lib/event-bus';
import { cn } from '@/lib/utils';
import type { NodeState } from '@/types/loom';

// Newly created modular components
import CompactLoomView from '@/components/dashboard/loom/compact-loom-view';
import ExpandedLoomView from '@/components/dashboard/loom/expanded-loom-view';

import { Filter, Zap, Cpu, Heartbeat } from 'phosphor-react';
import { useBeepChat } from '@/hooks/use-beep-chat';


const initialWorkflow: NodeState[] = [
    { id: 'trigger', label: 'Trigger: New Text Input', icon: Zap, status: 'idle' },
    { id: 'condition', label: 'AI: Is Invoice?', icon: Filter, status: 'idle', isCondition: true },
    { id: 'action-extract', label: 'AI: Extract Data', icon: Cpu, status: 'idle' },
    { id: 'action-log', label: 'Log & Alert Aegis', icon: Heartbeat, status: 'idle' },
];

const initialNodePositions: Record<string, { x: number; y: number }> = {
    trigger: { x: 50, y: 150 },
    condition: { x: 300, y: 150 },
    'action-extract': { x: 550, y: 150 },
    'action-log': { x: 800, y: 150 },
};

const EXPAND_BREAKPOINT_WIDTH = 700;

const LoomStudioPage: React.FC = () => {
    const [nodes, setNodes] = useState<NodeState[]>(initialWorkflow);
    const [nodePositions, setNodePositions] = useState(initialNodePositions);
    const [isSimulating, setIsSimulating] = useState(false);
    const [inputText, setInputText] = useState('');
    const [detailedNode, setDetailedNode] = useState<NodeState | null>(null);
    const { toast } = useToast();
    const { append: beepAppend, isLoading: isBeepLoading } = useBeepChat();

    const containerRef = useRef<HTMLDivElement>(null);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const resizeObserver = new ResizeObserver(entries => {
            if (!entries || entries.length === 0) return;
            const { width, height } = entries[0].contentRect;
            setContainerSize({ width, height });
        });
        const currentContainer = containerRef.current;
        if (currentContainer) {
            resizeObserver.observe(currentContainer);
        }
        return () => {
            if (currentContainer) {
                resizeObserver.unobserve(currentContainer);
            }
        };
    }, []);

    useEffect(() => {
        // The simulation is driven by the global BEEP loading state
        setIsSimulating(isBeepLoading);
    }, [isBeepLoading]);

    const updateNodeState = useCallback((nodeId: string, newState: Partial<NodeState>) => {
        setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, ...newState } : n));
    }, []);

    // Listen for events from the agent to update the UI
    useEffect(() => {
        const handleCategorizeSuccess = (result: any) => updateNodeState('condition', { status: 'completed', output: result });
        const handleExtractSuccess = (result: any) => updateNodeState('action-extract', { status: 'completed', output: result });
        const handleLogSuccess = (result: any) => updateNodeState('action-log', { status: 'completed', output: result });
        
        const handleError = (nodeId: string) => (error: string) => updateNodeState(nodeId, { status: 'failed', error });

        eventBus.on('loom:categorizeText:success', handleCategorizeSuccess);
        eventBus.on('loom:extractInvoiceData:success', handleExtractSuccess);
        eventBus.on('loom:logAndAlertAegis:success', handleLogSuccess);
        
        eventBus.on('loom:categorizeText:error', handleError('condition'));
        eventBus.on('loom:extractInvoiceData:error', handleError('action-extract'));
        eventBus.on('loom:logAndAlertAegis:error', handleError('action-log'));

        return () => {
            eventBus.off('loom:categorizeText:success');
            eventBus.off('loom:extractInvoiceData:success');
            eventBus.off('loom:logAndAlertAegis:success');
            eventBus.off('loom:categorizeText:error');
            eventBus.off('loom:extractInvoiceData:error');
            eventBus.off('loom:logAndAlertAegis:error');
        };
    }, [updateNodeState]);

    const handleNodePositionChange = (id: string, info: PanInfo) => {
        setNodePositions(prev => ({
            ...prev,
            [id]: { x: prev[id].x + info.delta.x, y: prev[id].y + info.delta.y }
        }));
    };

    const runSimulation = useCallback(() => {
        // Reset the UI state and send the prompt to the BEEP agent
        setNodes(initialWorkflow);
        updateNodeState('trigger', { status: 'completed', output: { receivedAt: new Date().toISOString(), characters: inputText.length } });
        updateNodeState('condition', { status: 'running' });
        beepAppend({ role: 'user', content: `Analyze the following text: """${inputText}"""` });
        eventBus.emit('orchestration:log', { task: 'Loom: Triggered', status: 'success', details: `Processing ${inputText.length} characters.`, targetId: 'loomStudio' });
    }, [inputText, beepAppend, updateNodeState]);

    const handleSendToBEEP = () => {
        if (!inputText || isSimulating) return;
        beepAppend({ role: 'user', content: `Analyze the following text: """${inputText}"""` });
        toast({ title: "Sent to BEEP", description: "The text has been sent to the BEEP interface for processing." });
    };

    const findNode = (id: string) => nodes.find(n => n.id === id)!;
    
    const sharedProps = {
        nodes,
        inputText,
        setInputText,
        isSimulating,
        runSimulation,
        handleSendToBEEP,
        onInspectNode: setDetailedNode,
        findNode
    };
    
    return (
      <div className="h-full w-full p-4 md:p-8 flex flex-col">
        <h1 className="text-3xl font-bold font-headline text-primary mb-2">Loom Studio</h1>
        <p className="text-muted-foreground mb-6">Design, test, and orchestrate complex AI agent workflows visually.</p>
        
            <div ref={containerRef} className="flex-grow h-full w-full">
                {containerSize.width > EXPAND_BREAKPOINT_WIDTH 
                    ? <ExpandedLoomView {...sharedProps} nodePositions={nodePositions} onNodePositionChange={handleNodePositionChange} /> 
                    : <CompactLoomView {...sharedProps} />
                }
            </div>

            <Dialog open={!!detailedNode} onOpenChange={(isOpen) => !isOpen && setDetailedNode(null)}>
                <DialogContent className="sm:max-w-md">
                    {detailedNode && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 font-headline">
                                    <detailedNode.icon className="w-5 h-5 text-primary" />
                                    <span>Node: {detailedNode.label}</span>
                                </DialogTitle>
                                <DialogDescription>
                                    Status:
                                    <Badge variant={detailedNode.status === 'completed' ? 'default' : 'destructive'} className={cn('ml-2', detailedNode.status === 'completed' ? 'badge-success' : 'badge-failure')}>
                                        {detailedNode.status}
                                    </Badge>
                                </DialogDescription>
                            </DialogHeader>
                            <div className="mt-4 text-sm space-y-4">
                                <h4 className="font-semibold text-muted-foreground">Result Data</h4>
                                {detailedNode.output && (
                                    <ScrollArea className="max-h-64">
                                        <pre className="text-xs bg-black/20 text-foreground p-3 rounded-md overflow-x-auto font-mono">
                                            <code>{JSON.stringify(detailedNode.output, null, 2)}</code>
                                        </pre>
                                    </ScrollArea>
                                )}
                                {detailedNode.error && (
                                    <pre className="text-xs bg-destructive/10 text-destructive-foreground p-3 rounded-md overflow-x-auto font-mono">
                                        <code>{detailedNode.error}</code>
                                    </pre>
                                )}
                                {!detailedNode.output && !detailedNode.error && (
                                    <p className="text-muted-foreground text-center py-4">No output data for this node.</p>
                                )}
                            </div>
                            <DialogFooter>
                                <Button onClick={() => setDetailedNode(null)}>Close</Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
      </div>
    );
};

export default LoomStudioPage;
