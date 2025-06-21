
"use client";
import React from 'react';
import { 
    ZapIcon, 
    GitForkIcon, 
    EyeIcon, 
    LogInIcon,
    DatabaseZapIcon,
    BrainCircuitIcon
} from '@/components/icons';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

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

const WorkflowNode: React.FC<{ icon: React.ElementType; label: string; className?: string }> = ({ icon: Icon, label, className }) => (
  <div className={cn(
      "flex items-center gap-2 bg-card border border-border/50 text-foreground text-xs rounded-lg px-3 py-1.5 shadow-sm hover:border-primary/50 transition-colors cursor-pointer", 
      className
    )}>
    <Icon className="w-3 h-3 text-primary" />
    <span className="font-medium">{label}</span>
  </div>
);

const WorkflowConnector: React.FC<{ vertical?: boolean; className?: string }> = ({ vertical, className }) => (
  <div className={cn(
      "bg-border/70",
      vertical ? "w-px h-4" : "h-px flex-1",
      className
  )} />
);


const LoomStudioCardContent: React.FC = () => {
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
        
       <div className="flex-grow w-full border border-dashed border-border/30 rounded-lg bg-background/20 flex flex-col items-center justify-center p-4 space-y-1 min-h-[160px]">
          <p className="text-xs text-muted-foreground mb-3 font-semibold">Example Agentic Workflow</p>
          
          <WorkflowNode icon={LogInIcon} label="Trigger: New Email" />
          <WorkflowConnector vertical />
          
          <div className="flex items-center w-full max-w-[80%]">
            <WorkflowConnector />
            <WorkflowNode icon={GitForkIcon} label="Is Invoice?" className="bg-secondary/20 border-secondary/50 text-secondary-foreground" />
            <WorkflowConnector />
          </div>

          <div className="flex justify-between w-full h-12">
            <div className="flex flex-col items-center w-1/2">
                 <WorkflowConnector vertical />
                 <WorkflowNode icon={DatabaseZapIcon} label="Extract Data" />
            </div>
             <div className="flex flex-col items-center w-1/2">
                 <WorkflowConnector vertical />
                 <WorkflowNode icon={BrainCircuitIcon} label="Categorize" />
            </div>
          </div>
        </div>
    </div>
  );
};

export default LoomStudioCardContent;
