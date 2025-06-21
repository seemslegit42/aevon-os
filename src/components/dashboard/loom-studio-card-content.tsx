
"use client";
import React, { useState, useCallback, type ElementType } from 'react';
import { 
    GitForkIcon, 
    LogInIcon,
    DatabaseZapIcon,
    BrainCircuitIcon,
    PlayIcon,
    CheckCircleIcon,
    AlertCircleIcon,
    FileTextIcon,
    InfoIcon
} from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import eventBus from '@/lib/event-bus';
import { Textarea } from '@/components/ui/textarea';
import type { TextCategory, InvoiceData } from '@/lib/ai-schemas';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';


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
    return (
        <div className="flex items-center w-full group">
            <div className={cn(
                "flex-grow flex items-center gap-2 bg-card border border-border/50 text-foreground text-xs rounded-lg px-3 py-1.5 shadow-sm transition-all duration-300 w-full justify-center", 
                node.status === 'running' && 'animate-pulse border-accent/50 bg-accent/10',
                node.status === 'completed' && 'border-chart-4/50 bg-chart-4/10',
                node.status === 'failed' && 'border-destructive/50 bg-destructive/10',
                node.isCondition && "bg-secondary/20 border-secondary/50 text-secondary-foreground"
            )}>
                {node.status === 'completed' ? <CheckCircleIcon className="w-3 h-3 text-chart-4" />
                : node.status === 'failed' ? <AlertCircleIcon className="w-3 h-3 text-destructive" />
                : <node.icon className="w-3 h-3 text-primary" />}
                <span className="font-medium">{node.label}</span>
            </div>
             <Button 
                variant="ghost" 
                size="icon" 
                className={cn("ml-2 h-6 w-6 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity", canInspect ? "opacity-60" : "invisible")} 
                onClick={() => canInspect && onInspect(node)}
                disabled={!canInspect}
                >
                <InfoIcon className="h-4 w-4" />
                <span className="sr-only">Inspect Node</span>
            </Button>
        </div>
    );
};

const WorkflowConnector: React.FC<{ vertical?: boolean; className?: string }> = ({ vertical, className }) => (
  <div className={cn("bg-border/70 transition-colors", vertical ? "w-px h-4" : "h-px flex-1", className)} />
);

const LoomStudioCardContent: React.FC = () => {
    const [nodes, setNodes] = useState<NodeState[]>(initialWorkflow);
    const [isSimulating, setIsSimulating] = useState(false);
    const [inputText, setInputText] = useState(sampleInvoiceText);
    const [detailedNode, setDetailedNode] = useState<NodeState | null>(null);
    const { toast } = useToast();
    const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

    const updateNodeState = useCallback((nodeId: string, newState: Partial<NodeState>) => {
        setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, ...newState } : n));
    }, []);
    
    const handleInspectNode = (node: NodeState) => {
        setDetailedNode(node);
    };

    const runTriggerStep = useCallback(async () => {
        updateNodeState('trigger', { status: 'running' });
        await sleep(300);
        updateNodeState('trigger', { status: 'completed', output: { characters: inputText.length, receivedAt: new Date().toISOString() } });
        eventBus.emit('orchestration:log', { task: 'Loom: Triggered', status: 'success', details: `Processing ${inputText.length} characters.`, targetId: 'loomStudio' });
    }, [inputText, updateNodeState]);

    const runCategorizationStep = useCallback(async (): Promise<TextCategory> => {
        updateNodeState('condition', { status: 'running' });
        const catResponse = await fetch('/api/ai/categorize-text', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: inputText }),
        });
        if (!catResponse.ok) throw new Error('Categorization API failed');
        const categoryResult: TextCategory = await catResponse.json();
        
        updateNodeState('condition', { status: 'completed', output: categoryResult });
        eventBus.emit('orchestration:log', { task: 'Loom: Categorized', status: 'success', details: `Text classified as: ${categoryResult.category}`, targetId: 'loomStudio' });
        return categoryResult;
    }, [inputText, updateNodeState]);

    const runExtractionStep = useCallback(async () => {
        updateNodeState('action-extract', { status: 'running' });
        const extractResponse = await fetch('/api/ai/extract-invoice-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: inputText }),
        });
        if (!extractResponse.ok) throw new Error('Extraction API failed');
        const extractResult: InvoiceData = await extractResponse.json();
        
        updateNodeState('action-extract', { status: 'completed', output: extractResult });
        eventBus.emit('orchestration:log', { task: 'Loom: Extracted', status: 'success', details: extractResult.summary, targetId: 'loomStudio' });
        return extractResult;
    }, [inputText, updateNodeState]);
    
    const runLoggingStep = useCallback(async (extractedData: InvoiceData | null) => {
        updateNodeState('action-log', { status: 'running' });
        await sleep(300);
        const logOutput = { status: "Logged OK", loggedAt: new Date().toISOString() };
        updateNodeState('action-log', { status: 'completed', output: logOutput });
        eventBus.emit('orchestration:log', { task: 'Loom: Logged', status: 'success', details: 'Workflow results logged to system.', targetId: 'loomStudio' });
        
        // Fire the alert to Aegis
        const securityAlert = {
          event: "External Document Processed",
          source: "Loom Studio Workflow",
          timestamp: new Date().toISOString(),
          details: "An external document was processed and identified as an invoice.",
          extractedData: extractedData ? {
              invoiceNumber: extractedData.invoiceNumber,
              amount: extractedData.amount,
              dueDate: extractedData.dueDate,
          } : "No data extracted."
        };
        
        eventBus.emit('aegis:new-alert', JSON.stringify(securityAlert, null, 2));
        eventBus.emit('orchestration:log', { task: 'Aegis Alert Sent', status: 'success', details: 'Forwarded processing log to Aegis Security.', targetId: 'aegisSecurity' });

    }, [updateNodeState]);


    const runSimulation = useCallback(async () => {
        setIsSimulating(true);
        setNodes(initialWorkflow);
        let extractedData: InvoiceData | null = null;

        try {
            await runTriggerStep();
            await sleep(400);

            const categoryResult = await runCategorizationStep();
            await sleep(400);

            if (categoryResult.isMatch) {
                extractedData = await runExtractionStep();
            } else {
                updateNodeState('action-extract', { status: 'failed', error: "Skipped: Text was not categorized as an invoice." });
            }
            await sleep(400);
            
            await runLoggingStep(extractedData);

        } catch (error: any) {
            const errorMessage = error.message || "An unknown error occurred during simulation.";
            toast({ variant: "destructive", title: "Simulation Failed", description: errorMessage });
            eventBus.emit('orchestration:log', { task: 'Loom: Workflow Failed', status: 'failure', details: errorMessage, targetId: 'loomStudio' });
            setNodes(prev => prev.map(n => n.status === 'running' ? { ...n, status: 'failed', error: errorMessage } : n));
        } finally {
            setIsSimulating(false);
        }
    }, [toast, runTriggerStep, runCategorizationStep, runExtractionStep, runLoggingStep, updateNodeState]);

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
            
            <div className="flex-grow w-full border border-dashed border-border/30 rounded-lg bg-background/20 flex flex-col items-center p-4 space-y-2 min-h-[250px]">
                <div className="flex justify-between items-center w-full mb-3">
                    <p className="text-xs text-muted-foreground font-semibold">Live Agentic Workflow</p>
                    <Button size="sm" variant="outline" onClick={runSimulation} disabled={isSimulating || !inputText}>
                        <PlayIcon className="w-4 h-4 mr-2" />
                        {isSimulating ? 'Simulating...' : 'Run Simulation'}
                    </Button>
                </div>
                
                <div className="w-full max-w-xs mx-auto flex flex-col items-center space-y-2">
                    <WorkflowNode node={findNode('trigger')} onInspect={handleInspectNode} />
                    <WorkflowConnector vertical />
                    <WorkflowNode node={findNode('condition')} onInspect={handleInspectNode} />
                    <WorkflowConnector vertical />
                    <WorkflowNode node={findNode('action-extract')} onInspect={handleInspectNode} />
                    <WorkflowConnector vertical />
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
                                <pre className="text-xs bg-muted/50 text-foreground p-3 rounded-md overflow-x-auto">
                                    <code>{JSON.stringify(detailedNode.output, null, 2)}</code>
                                </pre>
                            </ScrollArea>
                        )}
                        {detailedNode.error && (
                            <pre className="text-xs bg-destructive/10 text-destructive p-3 rounded-md overflow-x-auto">
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
