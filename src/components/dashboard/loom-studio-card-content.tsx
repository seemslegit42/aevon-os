
"use client";
import React from 'react';
import { ZapIcon, GitForkIcon, EyeIcon, Settings2Icon as SettingsIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

const FeatureListItem: React.FC<{ icon: React.ElementType; title: string; description: string; }> = ({ icon: Icon, title, description }) => (
  <li className="flex items-start">
    <Icon className="w-5 h-5 text-accent mr-3 mt-1 shrink-0" />
    <div>
      <h4 className="font-semibold text-foreground">{title}</h4>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  </li>
);

const WorkflowNode: React.FC<{ label: string; className?: string }> = ({ label, className }) => (
  <div className={cn("bg-primary/20 border border-primary/50 text-primary-foreground text-xs rounded-md px-3 py-1.5 shadow-sm", className)}>
    {label}
  </div>
);

const WorkflowConnector: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("flex-1 h-px bg-border/50", className)} />
);


const LoomStudioCardContent: React.FC = () => {
  return (
    <div className="space-y-4 h-full flex flex-col p-2">
        <div className="w-full h-full border border-dashed border-border/50 rounded-lg bg-muted/20 flex flex-col items-center justify-center p-4 space-y-4 min-h-[120px]">
          <div className="flex items-center w-full">
              <WorkflowNode label="Trigger: User Login" />
              <WorkflowConnector />
              <WorkflowNode label="Agent: Aegis" />
              <WorkflowConnector />
              <WorkflowNode label="Action: Analyze" />
          </div>
           <div className="h-4 w-px bg-border/50" />
           <div className="flex items-center w-full justify-end">
              <WorkflowNode label="Notify: BEEP" className="bg-secondary/30 border-secondary/50" />
              <WorkflowConnector />
              <WorkflowNode label="Process: Data" />
           </div>
           <p className="text-xs text-muted-foreground mt-2">Conceptual Workflow Diagram</p>
        </div>
      
      <div>
        <h3 className="font-headline text-md text-primary dark:text-primary-foreground mb-3">Key Capabilities</h3>
        <ul className="space-y-3 text-foreground">
           <FeatureListItem icon={ZapIcon} title="Dynamic Workflow Weaver" description="Visually orchestrate intelligent agents that learn and adapt." />
           <FeatureListItem icon={GitForkIcon} title="Adaptive Behavior Debugging" description="Intuitively step through and refine evolving agent behaviors." />
           <FeatureListItem icon={EyeIcon} title="Real-time AI Observability" description="Monitor your AI ecosystem as it learns and executes tasks." />
           <FeatureListItem icon={SettingsIcon} title="Evolving Agent Core" description="Explore and fine-tune the evolving logic of your AI agents." />
        </ul>
      </div>
    </div>
  );
};

export default LoomStudioCardContent;
