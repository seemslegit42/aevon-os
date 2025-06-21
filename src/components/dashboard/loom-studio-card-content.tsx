
"use client";
import React, { useState, useCallback, type ElementType } from 'react';
import { 
    ZapIcon, 
    GitForkIcon, 
    EyeIcon, 
    LogInIcon,
    DatabaseZapIcon,
    BrainCircuitIcon,
    PlayIcon,
    CheckCircleIcon
} from '@/components/icons';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import eventBus from '@/lib/event-bus';

const FeatureListItem: React.FC<{ icon: React.ElementType; title: string; description: string; }> = ({ icon: Icon, title, description }) => (
  <li className="flex items-start space-x-3">
    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
        <Icon className="w-4 h-4 text-primary" />
    </div>
    <div>
      <h4 className="font-semibold text-foreground text-sm">{title}</h4>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  </li>
);

interface NodeState {
  id: string;
  label: string;
  icon: ElementType;
  status: 'idle' | 'running' | 'completed' | 'failed';
  isCondition?: boolean;
}

const WorkflowNode: React.FC<{ node: NodeState }> = ({ node }) => (
  <div className={cn(
      "flex items-center gap-2 bg-card border border-border/50 text-foreground text-xs rounded-lg px-3 py-1.5 shadow-sm transition-all duration-300", 
      node.status === 'running' && 'workflow-node-running',
      node.status === 'completed' && 'workflow-node-completed',
      node.isCondition && "bg-secondary/20 border-secondary/50 text-secondary-foreground"
    )}>
    {node.status === 'completed' ? (
        <CheckCircleIcon className="w-3 h-3 text-chart-4" />
    ) : (
        <node.icon className="w-3 h-3 text-primary" />
    )}
    <span className="font-medium">{node.label}</span>
  </div>
);

const WorkflowConnector: React.FC<{ vertical?: boolean; className?: string }> = ({ vertical, className }) => (
  <div className={cn(
      "bg-border/70 transition-colors",
      vertical ? "w-px h-4" : "h-px flex-1",
      className
  )} />
);

const initialWorkflow: NodeState[] = [
    { id: 'trigger', label: 'Trigger: New Email', icon: LogInIcon, status: 'idle' },
    { id: 'condition', label: 'Is Invoice?', icon: GitForkIcon, status: 'idle', isCondition: true },
    { id: 'action-extract', label: 'Extract Data', icon: DatabaseZapIcon, status: 'idle' },
    { id: 'action-categorize', label: 'Categorize', icon: BrainCircuitIcon, status: 'idle' },
];

const LoomStudioCardContent: React.FC = () => {
    const [nodes, setNodes] = useState<NodeState[]>(initialWorkflow);
    const [isSimulating, setIsSimulating] = useState(false);

    const runSimulation = useCallback(async () => {
        setIsSimulating(true);
        // Reset statuses
        setNodes(initialWorkflow);

        const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

        for (let i = 0; i < initialWorkflow.length; i++) {
            const nodeId = initialWorkflow[i].id;
            const nodeLabel = initialWorkflow[i].label;

            // Set current node to running
            setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, status: 'running' } : n));
            eventBus.emit('orchestration:log', { 
                task: `Loom: Running Node`, 
                status: 'success', 
                details: `Executing "${nodeLabel}"` 
            });

            await sleep(1000);

            // Set current node to completed
            setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, status: 'completed' } : n));
             eventBus.emit('orchestration:log', { 
                task: `Loom: Node Complete`, 
                status: 'success', 
                details: `Node "${nodeLabel}" completed successfully.` 
            });

            await sleep(300);
        }

        setIsSimulating(false);
    }, []);

    const findNode = (id: string) => nodes.find(n => n.id === id)!;

  return (
    <div className="space-y-3 h-full flex flex-col p-2">
      <div>
        <h3 className="font-headline text-md text-primary dark:text-primary-foreground mb-3">Key Capabilities</h3>
        <ul className="space-y-3 text-foreground">
           <FeatureListItem icon={ZapIcon} title="Visual Workflow Builder" description="Drag-and-drop agents and actions to create complex automations." />
           <FeatureListItem icon={GitForkIcon} title="Conditional Logic" description="Branch workflows with 'if/then' logic for dynamic agent behavior." />
           <FeatureListItem icon={EyeIcon} title="Real-time Observability" description="Monitor your AI ecosystem as it executes tasks and makes decisions." />
        </ul>
      </div>

       <Separator className="bg-border/30 my-1" />
        
       <div className="flex-grow w-full border border-dashed border-border/30 rounded-lg bg-background/20 flex flex-col items-center p-4 space-y-1 min-h-[160px]">
           <div className="flex justify-between items-center w-full mb-3">
             <p className="text-xs text-muted-foreground font-semibold">Example Agentic Workflow</p>
             <Button size="sm" variant="outline" onClick={runSimulation} disabled={isSimulating}>
                <PlayIcon className="w-4 h-4 mr-2" />
                {isSimulating ? 'Simulating...' : 'Run Simulation'}
             </Button>
           </div>
          
          <WorkflowNode node={findNode('trigger')} />
          <WorkflowConnector vertical />
          
          <div className="flex items-center w-full max-w-[80%]">
            <WorkflowConnector />
            <WorkflowNode node={findNode('condition')} />
            <WorkflowConnector />
          </div>

          <div className="flex justify-between w-full h-12">
            <div className="flex flex-col items-center w-1/2">
                 <WorkflowConnector vertical />
                 <WorkflowNode node={findNode('action-extract')} />
            </div>
             <div className="flex flex-col items-center w-1/2">
                 <WorkflowConnector vertical />
                 <WorkflowNode node={findNode('action-categorize')} />
            </div>
          </div>
        </div>
    </div>
  );
};

export default LoomStudioCardContent;
