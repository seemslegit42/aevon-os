
"use client";

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FileIcon, PlayIcon, MailIcon } from '@/components/icons';
import WorkflowNode from './workflow-node';
import type { NodeState } from '@/types/loom';
import { useBeepChat } from '@/hooks/use-beep-chat';

// The simple vertical connector for compact view
const WorkflowConnector: React.FC = () => (
  <div className="w-px h-6 bg-border/30 mx-auto" />
);

interface CompactLoomViewProps {
  nodes: NodeState[];
  inputText: string;
  setInputText: (text: string) => void;
  isSimulating: boolean;
  runSimulation: () => void;
  handleSendToBEEP: () => void;
  onInspectNode: (node: NodeState) => void;
  findNode: (id: string) => NodeState;
}

const CompactLoomView: React.FC<CompactLoomViewProps> = ({ 
    nodes,
    inputText,
    setInputText,
    isSimulating,
    runSimulation,
    handleSendToBEEP,
    onInspectNode,
    findNode
}) => (
    <ScrollArea className="h-full pr-2">
        <div className="space-y-4 h-full flex flex-col p-1">
            <div className="flex-shrink-0">
                <label htmlFor="loom-input-compact" className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                   <FileIcon /> Input Text for Simulation
                </label>
                <Textarea
                    id="loom-input-compact"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    rows={6}
                    className="bg-input border-input placeholder:text-muted-foreground text-xs font-mono"
                    disabled={isSimulating}
                />
            </div>
            
            <div className="flex-grow w-full border border-border/20 rounded-lg bg-background/20 flex flex-col p-4 space-y-2 min-h-[300px]">
                <div className="flex justify-between items-center w-full mb-3">
                    <p className="text-sm text-muted-foreground font-semibold">Workflow</p>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={runSimulation} disabled={isSimulating || !inputText}>
                            <PlayIcon />
                            {isSimulating ? 'Running...' : 'Run'}
                        </Button>
                         <Button size="sm" className="btn-gradient-primary-accent" onClick={handleSendToBEEP} disabled={isSimulating || !inputText}>
                            <MailIcon />
                            Send
                        </Button>
                    </div>
                </div>
                
                <div className="w-full max-w-md mx-auto flex flex-col items-center">
                    <WorkflowNode node={findNode('trigger')!} onInspect={onInspectNode} />
                    <WorkflowConnector />
                    <WorkflowNode node={findNode('condition')!} onInspect={onInspectNode} />
                    <WorkflowConnector />
                    <WorkflowNode node={findNode('action-extract')!} onInspect={onInspectNode} />
                    <WorkflowConnector />
                    <WorkflowNode node={findNode('action-log')!} onInspect={onInspectNode} />
                </div>
            </div>
        </div>
    </ScrollArea>
);

export default CompactLoomView;
