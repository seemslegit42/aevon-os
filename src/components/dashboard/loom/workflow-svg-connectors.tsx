
import React from 'react';
import { cn } from '@/lib/utils';
import type { Position } from 'react-rnd';

interface WorkflowSVGConnectorsProps {
    from: Position;
    to: Position;
    nodeWidth: number;
    status: 'idle' | 'running' | 'completed' | 'failed';
    label?: string;
}

const WorkflowSVGConnectors: React.FC<WorkflowSVGConnectorsProps> = ({ from, to, nodeWidth, status, label }) => {
    const startX = from.x + nodeWidth;
    const startY = from.y + 24; // vertically center of the node
    const endX = to.x;
    const endY = to.y + 24;
    
    const path = `M ${startX} ${startY} C ${startX + 50} ${startY}, ${endX - 50} ${endY}, ${endX} ${endY}`;
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;

    return (
        <g>
            <path d={path} stroke="hsl(var(--border))" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)"
                className={cn(
                    "transition-all duration-500",
                    status === 'completed' || status === 'running' ? "stroke-accent" : "stroke-border"
                )}
            />
            {label && (
                <text x={midX} y={midY - 10} fill="hsl(var(--muted-foreground))" fontSize="12" textAnchor="middle" className="font-sans">
                    {label}
                </text>
            )}
        </g>
    );
};

export default WorkflowSVGConnectors;
