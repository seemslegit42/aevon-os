
"use client";
import React, { useState, useCallback, type ElementType, useEffect } from 'react';
import {
    GitForkIcon,
    LogInIcon,
    DatabaseZapIcon,
    BrainCircuitIcon,
    PlayIcon,
    CheckCircleIcon,
    AlertCircleIcon,
    FileTextIcon,
    InfoIcon,
    LoaderIcon
} from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import eventBus from '@/lib/event-bus';
import { Textarea } from '@/components/ui/textarea';
import type { InvoiceData } from '@/lib/ai-schemas';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useChat } from 'ai/react';


// Sample invoice text
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

interface NodeState {
  id: string;
  label: string;
  icon: ElementType;
  status: 'idle' | 'running' | 'completed' | 'failed';
  isCondition?: boolean;
  output?: any | null;
  error?: string | null;
}

const initialWorkflow: NodeState[] = [
    { id: 'trigger', label: 'Trigger: New Text Input', icon: LogInIcon, status: 'idle' },
    { id: 'condition', label: 'AI: Is Invoice?', icon: GitForkIcon, status: 'idle', isCondition: true },
    { id: 'action-extract', label: 'AI: Extract Data', icon: DatabaseZapIcon, status: 'idle' },
    { id: 'action-log', label: 'Log & Alert Aegis', icon: BrainCircuitIcon, status: 'idle' },
];

interface WorkflowNodeProps {
  node: NodeState;
  onInspect: (node: NodeState) => void;
}

const WorkflowNode: React.FC<WorkflowNodeProps> = ({ node, onInspect }) => {
    const canInspect = node.status === 'completed' || node.status === 'failed';
    const NodeIcon = node.icon;
    return (
        <div className="flex items-center w-full group">
            <div className={cn(
                "flex-grow flex items-center gap-3 border text-foreground text-sm rounded-lg px-3 py-2 shadow-sm transition-all duration-300 w-full",
                {
                  'bg-card border-border/50': node.status === 'idle',
                  'border-accent bg-accent/10 animate-pulse': node.status === 'running',
                  'border-chart-4 bg-chart-4/10': node.status === 'completed',
                  'border-destructive bg-destructive/10': node.status === 'failed',
                  'bg-secondary/10 border-secondary/50 font-semibold': node.isCondition
                }
            )}>
                {node.status === 'running' ? <LoaderIcon className="w-4 h-4 text-accent animate-spin" /> : <NodeIcon className="w-4 h-4 text-primary" />}
                <span className="font-medium">{node.label}</span>
                <div className="flex-grow" />
                {node.status === 'completed' && <CheckCircleIcon className="w-4 h-4 text-chart-4" />}
                {node.status === 'failed' && <AlertCircleIcon className="w-4 h-4 text-destructive" />}
            </div>
             <Button
                variant="ghost"
                size="icon"
                className={cn(
                    "ml-2 h-8 w-8 flex-shrink-0 transition-opacity",
                    canInspect ? "opacity-40 group-hover:opacity-100" : "opacity-0 invisible"
                )}
                onClick={() => canInspect && onInspect(node)}
                disabled={!canInspect}
                >
                <InfoIcon className="h-4 w-4" />
                <span className="sr-only">Inspect Node</span>
            </Button>
        </div>
    );
};

const WorkflowConnector: React.FC = () => (
  <div className="w-px h-6 bg-border/30 mx-auto" />
);

const LoomStudioCardContent: React.FC = () => {
    const [nodes, setNodes] = useState<NodeState[]>(initialWorkflow);
    const [isSimulating, setIsSimulating] = useState(false);
    const [inputText, setInputText] = useState(sampleInvoiceText);
    const [detailedNode, setDetailedNode] = useState<NodeState | null>(null);
    const { toast } = useToast();

    // Use the main chat hook, but with a unique ID to isolate this conversation
    const { messages, append, setMessages, isLoading } = useChat({ id: 'loom-simulation' });

    // Map tool names from the agent to our UI node IDs
    const toolNodeMap: { [key: string]: string } = {
        categorizeText: 'condition',
        extractInvoiceData: 'action-extract',
        logAndAlertAegis: 'action-log',
    };

    const updateNodeState = useCallback((nodeId: string, newState: Partial<NodeState>) => {
        setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, ...newState } : n));
    }, []);

    const handleInspectNode = (node: NodeState) => {
        setDetailedNode(node);
    };

    const runSimulation = useCallback(() => {
        setIsSimulating(true);
        setNodes(initialWorkflow); // Reset visual state
        setMessages([]); // Clear previous simulation chat history
        append({
            role: 'user',
            content: `Please run the full analysis workflow on the following text: """${inputText}"""`
        });
        updateNodeState('trigger', { status: 'completed', output: { receivedAt: new Date().toISOString(), characters: inputText.length } });
        eventBus.emit('orchestration:log', { task: 'Loom: Triggered', status: 'success', details: `Processing ${inputText.length} characters.`, targetId: 'loomStudio' });
    }, [inputText, append, setMessages, updateNodeState]);

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

                        // If extraction was successful, fire the Aegis alert
                        if (toolCall.toolName === 'extractInvoiceData' && result.summary) {
                           const securityAlert = {
                                event: "Invoice Processed by Loom",
                                source: "Loom Studio Workflow",
                                timestamp: new Date().toISOString(),
                                details: result.summary,
                                extractedData: result,
                            };
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

    }, [messages, isSimulating, isLoading, updateNodeState]);


    const findNode = (id: string) => nodes.find(n => n.id === id)!;

  return (
    <>
    <ScrollArea className="h-full pr-2">
        <div className="space-y-4 h-full flex flex-col p-1">
            <div className="flex-shrink-0">
                <label htmlFor="loom-input" className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                   <FileTextIcon /> Input Text for Simulation
                </label>
                <Textarea
                    id="loom-input"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    rows={6}
                    className="bg-input border-input placeholder:text-muted-foreground text-xs font-mono"
                    disabled={isSimulating}
                />
            </div>
            
            <div className="flex-grow w-full border border-border/20 rounded-lg bg-background/20 flex flex-col p-4 space-y-2 min-h-[300px]">
                <div className="flex justify-between items-center w-full mb-3">
                    <p className="text-sm text-muted-foreground font-semibold">Workflow Simulation</p>
                    <Button size="sm" className="btn-gradient-primary-secondary" onClick={runSimulation} disabled={isSimulating || !inputText}>
                        <PlayIcon className="w-4 h-4 mr-2" />
                        {isSimulating ? 'Simulating...' : 'Run Simulation'}
                    </Button>
                </div>
                
                <div className="w-full max-w-md mx-auto flex flex-col items-center">
                    <WorkflowNode node={findNode('trigger')} onInspect={handleInspectNode} />
                    <WorkflowConnector />
                    <WorkflowNode node={findNode('condition')} onInspect={handleInspectNode} />
                    <WorkflowConnector />
                    <WorkflowNode node={findNode('action-extract')} onInspect={handleInspectNode} />
                    <WorkflowConnector />
                    <WorkflowNode node={findNode('action-log')} onInspect={handleInspectNode} />
                </div>
            </div>
        </div>
    </ScrollArea>
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
                </>
            )}
        </DialogContent>
    </Dialog>
    </>
  );
};

export default LoomStudioCardContent;
