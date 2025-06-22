
"use client";

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useChat } from 'ai/react';
import { useToast } from "@/hooks/use-toast";
import eventBus from '@/lib/event-bus';
import { cn } from '@/lib/utils';
import type { NodeState } from '@/types/loom';

// Newly created modular components
import CompactLoomView from '@/components/dashboard/loom/compact-loom-view';
import ExpandedLoomView from '@/components/dashboard/loom/expanded-loom-view';

// Icons remain in the main page component as they are part of the initial state definition
import {
    FilterIcon,
    ZapIcon,
    AIProcessingIcon,
    SystemDiagnosticsIcon,
} from '@/components/icons';


const sampleInvoiceText = `
To: Aevon Corp
From: Quantum Supplies Inc.
Invoice #: QS-2024-789
Date: 2024-07-15
Due Date: August 14, 2024

Line Items:
- 10x Positronic Brain Gels @ $500.00 each = $5,000.00
- 2x Chroniton Field Emitters @ $2,500.00 each = $5,000.00

Subtotal: $10,000.00
Tax (8.25%): $825.00
--------------------
Total Amount Due: $10,825.00
`;

const initialWorkflow: NodeState[] = [
    { id: 'trigger', label: 'Trigger: New Text Input', icon: ZapIcon, status: 'idle' },
    { id: 'condition', label: 'AI: Is Invoice?', icon: FilterIcon, status: 'idle', isCondition: true },
    { id: 'action-extract', label: 'AI: Extract Data', icon: AIProcessingIcon, status: 'idle' },
    { id: 'action-log', label: 'Log & Alert Aegis', icon: SystemDiagnosticsIcon, status: 'idle' },
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
    const [inputText, setInputText] = useState(sampleInvoiceText);
    const [detailedNode, setDetailedNode] = useState<NodeState | null>(null);
    const { toast } = useToast();
    const { messages, append, setMessages, isLoading } = useChat({ id: 'loom-simulation' });

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

    const toolNodeMap: { [key: string]: string } = {
        categorizeText: 'condition',
        extractInvoiceData: 'action-extract',
        logAndAlertAegis: 'action-log',
    };

    const updateNodeState = useCallback((nodeId: string, newState: Partial<NodeState>) => {
        setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, ...newState } : n));
    }, []);
    
    const handleNodePositionChange = (id: string, info: PanInfo) => {
        setNodePositions(prev => ({
            ...prev,
            [id]: { x: prev[id].x + info.delta.x, y: prev[id].y + info.delta.y }
        }));
    };

    const runSimulation = useCallback(() => {
        setIsSimulating(true);
        setNodes(initialWorkflow);
        setMessages([]);
        append({ role: 'user', content: `Please run the full analysis workflow on the following text: """${inputText}"""` });
        updateNodeState('trigger', { status: 'completed', output: { receivedAt: new Date().toISOString(), characters: inputText.length } });
        eventBus.emit('orchestration:log', { task: 'Loom: Triggered', status: 'success', details: `Processing ${inputText.length} characters.`, targetId: 'loomStudio' });
    }, [inputText, append, setMessages, updateNodeState]);

    const handleSendToBEEP = () => {
        if (!inputText || isSimulating) return;
        eventBus.emit('beep:submitQuery', `Analyze the following text: """${inputText}"""`);
        toast({ title: "Sent to BEEP", description: "The text has been sent to the BEEP interface for processing." });
    };

    useEffect(() => {
        if (!isSimulating) return;
        const lastMessage = messages.at(-1);
        if (!lastMessage) return;

        if (lastMessage.role === 'assistant' && lastMessage.tool_calls) {
            lastMessage.tool_calls.forEach(tc => {
                const nodeId = toolNodeMap[tc.toolName];
                if (nodeId) updateNodeState(nodeId, { status: 'running' });
            });
        } else if (lastMessage.role === 'tool') {
            const toolCallId = lastMessage.tool_call_id;
            const originatingMsg = messages.find(m => m.role === 'assistant' && m.tool_calls?.some(tc => tc.toolCallId === toolCallId));
            const toolCall = originatingMsg?.tool_calls?.find(tc => tc.toolCallId === toolCallId);

            if (toolCall) {
                const nodeId = toolNodeMap[toolCall.toolName];
                if (nodeId) {
                    try {
                        const result = JSON.parse(lastMessage.content);
                        updateNodeState(nodeId, { status: 'completed', output: result });
                        eventBus.emit('orchestration:log', { task: `Loom: ${toolCall.toolName}`, status: 'success', details: `Tool executed successfully.` });
                        
                        if (toolCall.toolName === 'extractInvoiceData' && result.summary) {
                           const securityAlert = { event: "Invoice Processed by Loom", source: "Loom Studio Workflow", timestamp: new Date().toISOString(), details: result.summary, extractedData: result };
                           eventBus.emit('aegis:new-alert', JSON.stringify(securityAlert, null, 2));
                        }
                    } catch (e) {
                         const error = "Failed to parse tool output.";
                         updateNodeState(nodeId, { status: 'failed', error });
                         eventBus.emit('orchestration:log', { task: `Loom: ${toolCall.toolName}`, status: 'failure', details: error });
                    }
                }
            }
        }
        
        if (!isLoading && messages.length > 1) {
            setIsSimulating(false);
        }
    }, [messages, isSimulating, isLoading, updateNodeState, toolNodeMap]);

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
        
        <TooltipProvider>
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
        </TooltipProvider>
      </div>
    );
};

export default LoomStudioPage;
