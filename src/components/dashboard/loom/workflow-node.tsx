"use client";

import React, { type ElementType } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import CheckCircleIcon from '@/components/icons/CheckCircleIcon';
import AlertTriangleIcon from '@/components/icons/AlertTriangleIcon';
import AIProcessingIcon from '@/components/icons/AIProcessingIcon';
import InfoCircleIcon from '@/components/icons/InfoCircleIcon';
import type { NodeState } from '@/types/loom';

interface WorkflowNodeProps {
  node: NodeState;
  onInspect: (node: NodeState) => void;
  isExpanded?: boolean;
}

const WorkflowNode: React.FC<WorkflowNodeProps> = ({ node, onInspect, isExpanded = false }) => {
    const canInspect = node.status === 'completed' || node.status === 'failed';
    const NodeIcon = node.icon;
    return (
    <TooltipProvider>
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
                {node.status === 'running' ? <AIProcessingIcon className="w-4 h-4 text-accent animate-spin" /> : <NodeIcon className="w-4 h-4 text-primary" />}
                <span className="font-medium">{node.label}</span>
                <div className="flex-grow" />
                {node.status === 'completed' && <CheckCircleIcon className="w-4 h-4 text-chart-4" />}
                {node.status === 'failed' && <AlertTriangleIcon className="w-4 h-4 text-destructive" />}
            </div>
             <Tooltip>
                <TooltipTrigger asChild>
                     <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "ml-2 h-8 w-8 flex-shrink-0 transition-opacity",
                             canInspect ? "opacity-40 group-hover:opacity-100" : (isExpanded ? "opacity-0 invisible" : "hidden")
                        )}
                        onClick={() => canInspect && onInspect(node)}
                        disabled={!canInspect}
                        >
                        <InfoCircleIcon className="h-4 w-4" />
                        <span className="sr-only">Inspect Node</span>
                    </Button>
                </TooltipTrigger>
                 <TooltipContent><p>Inspect Node Output</p></TooltipContent>
             </Tooltip>
        </div>
    </TooltipProvider>
    );
};

export default WorkflowNode;
