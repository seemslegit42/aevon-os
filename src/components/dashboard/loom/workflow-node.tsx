
"use client";

import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Cpu } from 'phosphor-react';
import { cn } from '@/lib/utils';

// Placeholder for a single node in the Loom workflow UI.
// You can replace this with your actual component implementation.
const WorkflowNode = () => {
    return (
        <Card className="w-64 glassmorphism-panel">
            <CardHeader className="flex flex-row items-center gap-3">
                <Cpu className="w-5 h-5 text-primary" />
                <CardTitle className="text-base font-headline">
                    Workflow Node
                </CardTitle>
            </CardHeader>
        </Card>
    );
};

export default WorkflowNode;
