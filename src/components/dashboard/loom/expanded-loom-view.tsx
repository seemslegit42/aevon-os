
"use client";

import React from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { File, Play, Envelope } from 'phosphor-react';
import WorkflowNode from './workflow-node';
import WorkflowSVGConnectors from './workflow-svg-connectors';
import type { NodeState } from '@/types/loom';
import { useBeepChat } from '@/hooks/use-beep-chat';

interface ExpandedLoomViewProps {
  nodes: NodeState[];
  nodePositions: Record<string, { x: number; y: number }>;
  onNodePositionChange: (id: string, info: PanInfo) => void;
  inputText: string;
  setInputText: (text: string) => void;
  isSimulating: boolean;
  runSimulation: () => void;
  handleSendToBEEP: () => void;
  onInspectNode: (node: NodeState) => void;
}

const ExpandedLoomView: React.FC<ExpandedLoomViewProps> = ({ 
    nodes,
    nodePositions,
    onNodePositionChange,
    inputText,
    setInputText,
    isSimulating,
    runSimulation,
    handleSendToBEEP,
    onInspectNode
}) => {
    
    const getNodeById = (id: string) => nodes.find((n: NodeState) => n.id === id);

    return (
        <div className="h-full flex flex-row gap-4">
            <div className="w-72 flex-shrink-0 flex flex-col gap-4">
                <div className="flex-shrink-0">
                    <label htmlFor="loom-input-expanded" className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                       <File /> Input Text
                    </label>
                    <Textarea
                        id="loom-input-expanded"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        rows={8}
                        className="bg-input border-input placeholder:text-muted-foreground text-xs font-mono"
                        disabled={isSimulating}
                    />
                </div>
                 <div className="flex flex-col gap-2">
                    <Button variant="outline" onClick={runSimulation} disabled={isSimulating || !inputText}>
                        <Play />
                        {isSimulating ? 'Simulating...' : 'Run Simulation'}
                    </Button>
                    <Button className="btn-gradient-primary-accent" onClick={handleSendToBEEP} disabled={isSimulating || !inputText}>
                        <Envelope />
                        Send to BEEP
                    </Button>
                </div>
            </div>

            <div className="flex-grow relative border border-border/20 rounded-lg bg-background/20 overflow-hidden">
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--border))" />
                        </marker>
                    </defs>
                    <WorkflowSVGConnectors
                        from={nodePositions.trigger} to={nodePositions.condition}
                        nodeWidth={250} status={getNodeById('trigger')?.status || 'idle'}
                    />
                    <WorkflowSVGConnectors
                        from={nodePositions.condition} to={nodePositions['action-extract']}
                        nodeWidth={250} status={getNodeById('condition')?.status || 'idle'}
                        label="Yes"
                    />
                     <WorkflowSVGConnectors
                        from={nodePositions['action-extract']} to={nodePositions['action-log']}
                        nodeWidth={250} status={getNodeById('action-extract')?.status || 'idle'}
                    />
                </svg>

                {nodes.map((node: NodeState) => (
                    <motion.div
                        key={node.id}
                        drag
                        onDragEnd={(event, info) => onNodePositionChange(node.id, info)}
                        className="absolute cursor-grab active:cursor-grabbing"
                        style={{
                            left: nodePositions[node.id].x,
                            top: nodePositions[node.id].y,
                            width: 250,
                        }}
                    >
                         <WorkflowNode node={node} onInspect={onInspectNode} isExpanded/>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export default ExpandedLoomView;
