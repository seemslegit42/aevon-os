
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
} from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import eventBus from '@/lib/event-bus';
import { Textarea } from '@/components/ui/textarea';
import type { TextCategory, InvoiceData } from '@/lib/ai-schemas';
import { ScrollArea } from '@/components/ui/scroll-area';

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
    { id: 'action-log', label: 'Log to System', icon: BrainCircuitIcon, status: 'idle' },
];

const WorkflowNode: React.FC<{ node: NodeState }> = ({ node }) => (
    <div className="flex flex-col items-center w-full">
        <div className={cn(
            "flex items-center gap-2 bg-card border border-border/50 text-foreground text-xs rounded-lg px-3 py-1.5 shadow-sm transition-all duration-300 w-full justify-center", 
            node.status === 'running' && 'workflow-node-running',
            node.status === 'completed' && 'workflow-node-completed',
            node.status === 'failed' && 'border-destructive/50 bg-destructive/10',
            node.isCondition && "bg-secondary/20 border-secondary/50 text-secondary-foreground"
        )}>
            {node.status === 'completed' ? <CheckCircleIcon className="w-3 h-3 text-chart-4" />
            : node.status === 'failed' ? <AlertCircleIcon className="w-3 h-3 text-destructive" />
            : <node.icon className="w-3 h-3 text-primary" />}
            <span className="font-medium">{node.label}</span>
        </div>
        {node.output && (
            <pre className={cn("workflow-node-output", node.status === 'completed' ? "workflow-node-output-success" : "workflow-node-output-failure")}>
                <code>{JSON.stringify(node.output, null, 2)}</code>
            </pre>
        )}
        {node.error && (
            <pre className="workflow-node-output workflow-node-output-failure">
                <code>{node.error}</code>
            </pre>
        )}
    </div>
);

const WorkflowConnector: React.FC<{ vertical?: boolean; className?: string }> = ({ vertical, className }) => (
  <div className={cn("bg-border/70 transition-colors", vertical ? "w-px h-4" : "h-px flex-1", className)} />
);

const LoomStudioCardContent: React.FC = () => {
    const [nodes, setNodes] = useState<NodeState[]>(initialWorkflow);
    const [isSimulating, setIsSimulating] = useState(false);
    const [inputText, setInputText] = useState(sampleInvoiceText);
    const { toast } = useToast();

    const updateNodeState = (nodeId: string, newState: Partial<NodeState>) => {
        setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, ...newState } : n));
    };

    const runSimulation = useCallback(async () => {
        setIsSimulating(true);
        setNodes(initialWorkflow); // Reset on new run
        const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

        try {
            // 1. Trigger
            updateNodeState('trigger', { status: 'running' });
            await sleep(500);
            updateNodeState('trigger', { status: 'completed', output: { characters: inputText.length } });
            eventBus.emit('orchestration:log', { task: 'Loom: Triggered', status: 'success', details: `Processing ${inputText.length} characters.` });
            
            await sleep(500);

            // 2. Condition (Categorization)
            updateNodeState('condition', { status: 'running' });
            const catResponse = await fetch('/api/ai/categorize-text', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: inputText }),
            });
            if (!catResponse.ok) throw new Error('Categorization API failed');
            const categoryResult: TextCategory = await catResponse.json();
            
            updateNodeState('condition', { status: 'completed', output: categoryResult });
            eventBus.emit('orchestration:log', { task: 'Loom: Categorized', status: 'success', details: `Text classified as: ${categoryResult.category}` });
            
            await sleep(500);

            // 3. Action (Extraction) - only if it's an invoice
            if (categoryResult.isMatch) {
                updateNodeState('action-extract', { status: 'running' });
                const extractResponse = await fetch('/api/ai/extract-invoice-data', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: inputText }),
                });
                if (!extractResponse.ok) throw new Error('Extraction API failed');
                const extractResult: InvoiceData = await extractResponse.json();
                
                updateNodeState('action-extract', { status: 'completed', output: extractResult });
                eventBus.emit('orchestration:log', { task: 'Loom: Extracted', status: 'success', details: extractResult.summary });

            } else {
                 updateNodeState('action-extract', { status: 'failed', error: "Skipped: Not an invoice." });
            }

            await sleep(500);
            
            // 4. Final Action
            updateNodeState('action-log', { status: 'running' });
            await sleep(500);
            updateNodeState('action-log', { status: 'completed', output: { status: "Logged OK" } });
            eventBus.emit('orchestration:log', { task: 'Loom: Logged', status: 'success', details: 'Workflow results logged to system.' });

        } catch (error: any) {
            const errorMessage = error.message || "An unknown error occurred during simulation.";
            toast({ variant: "destructive", title: "Simulation Failed", description: errorMessage });
            eventBus.emit('orchestration:log', { task: 'Loom: Workflow Failed', status: 'failure', details: errorMessage });
            // Mark running node as failed
            setNodes(prev => prev.map(n => n.status === 'running' ? { ...n, status: 'failed', error: errorMessage } : n));
        } finally {
            setIsSimulating(false);
        }
    }, [inputText, toast]);

    const findNode = (id: string) => nodes.find(n => n.id === id)!;

  return (
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
                    <WorkflowNode node={findNode('trigger')} />
                    <WorkflowConnector vertical />
                    <WorkflowNode node={findNode('condition')} />
                    <WorkflowConnector vertical />
                    <WorkflowNode node={findNode('action-extract')} />
                    <WorkflowConnector vertical />
                    <WorkflowNode node={findNode('action-log')} />
                </div>
            </div>
        </div>
    </ScrollArea>
  );
};

export default LoomStudioCardContent;
