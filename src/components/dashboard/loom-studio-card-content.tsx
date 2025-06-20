
"use client";
import React from 'react';
import { Settings2Icon as SettingsIcon, ZapIcon, GitForkIcon, EyeIcon } from '@/components/icons';

const LoomStudioCardContent: React.FC = () => {
  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="my-6 p-6 flex-grow">
        <div className="w-full h-full border border-dashed border-border rounded-lg bg-muted/50 flex items-center justify-center">
          <p className="text-muted-foreground">Conceptual Diagram Area for Loom Studio</p>
        </div>
      </div>
      
      <div>
        <h3 className="font-headline text-xl text-primary dark:text-primary-foreground mb-4">Key Capabilities:</h3>
        <ul className="list-disc list-inside space-y-3 text-foreground">
          <li className="flex items-start">
            <ZapIcon className="w-5 h-5 text-accent mr-2 mt-1 shrink-0" />
            <span><strong>Visual Workflow Builder:</strong> Drag-and-drop components to design sophisticated AI agent behaviors and interactions.</span>
          </li>
          <li className="flex items-start">
            <GitForkIcon className="w-5 h-5 text-accent mr-2 mt-1 shrink-0" />
            <span><strong>Event Debugging & Replay:</strong> Step through agent executions, inspect state, and replay events to quickly identify and fix issues.</span>
          </li>
          <li className="flex items-start">
            <EyeIcon className="w-5 h-5 text-accent mr-2 mt-1 shrink-0" />
            <span><strong>Live Observability & Prompt Diffing:</strong> Monitor agents in real-time, compare prompt versions, and understand the impact of changes instantly.</span>
          </li>
          <li className="flex items-start">
            <SettingsIcon className="w-5 h-5 text-accent mr-2 mt-1 shrink-0" />
            <span><strong>Agent DNA Viewer:</strong> Deep dive into the core logic and configuration of your AI agents for fine-grained control.</span>
          </li>
        </ul>
        <p className="mt-6 text-sm text-muted-foreground">
          Loom Studio empowers advanced users and AI agents to collaborate in building intelligent automation.
        </p>
      </div>
    </div>
  );
};

export default LoomStudioCardContent;
