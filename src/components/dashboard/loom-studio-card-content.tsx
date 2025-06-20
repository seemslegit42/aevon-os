
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
            <span><strong>Dynamic Workflow Weaver:</strong> Visually orchestrate intelligent agents that learn and adapt, creating fluid, responsive automations across your OS.</span>
          </li>
          <li className="flex items-start">
            <GitForkIcon className="w-5 h-5 text-accent mr-2 mt-1 shrink-0" />
            <span><strong>Adaptive Behavior Debugging:</strong> Intuitively step through and refine evolving agent behaviors, ensuring seamless data flow and robust performance.</span>
          </li>
          <li className="flex items-start">
            <EyeIcon className="w-5 h-5 text-accent mr-2 mt-1 shrink-0" />
            <span><strong>Real-time AI Observability:</strong> Monitor your AI ecosystem as it learns. Instantly understand and guide adaptive prompt chains and agent interactions.</span>
          </li>
          <li className="flex items-start">
            <SettingsIcon className="w-5 h-5 text-accent mr-2 mt-1 shrink-0" />
            <span><strong>Evolving Agent Core:</strong> Explore and fine-tune the evolving logic of your AI agents, fostering a deeply integrated and intelligent system.</span>
          </li>
        </ul>
        <p className="mt-6 text-sm text-muted-foreground">
          Loom Studio is where human ingenuity and adaptive AI converge to craft the next generation of dynamic, intelligent orchestrations.
        </p>
      </div>
    </div>
  );
};

export default LoomStudioCardContent;
