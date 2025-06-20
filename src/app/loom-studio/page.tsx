
import MicroAppCard from '@/components/micro-app-card';
import { Settings, Zap, GitBranch, Eye } from 'lucide-react';
// Image import removed

export default function LoomStudioPage() {
  return (
    <div className="space-y-8">
      <MicroAppCard
        title="Loom Studio: Orchestrate Intelligence"
        icon={Settings}
        description="Loom Studio is your AI-native micro-environment for crafting, debugging, and orchestrating complex AI workflows and prompt chains. Visually build, test, and deploy intelligent agents with unprecedented control and transparency."
      >
        <div className="my-6 p-6 glassmorphism-panel bg-background/30 dark:bg-background/30 rounded-lg">
          {/* Image component removed */}
          <div className="w-full h-[200px] md:h-[300px] lg:h-[400px] bg-muted/30 rounded-md flex items-center justify-center">
            <p className="text-muted-foreground">Conceptual Diagram Area</p>
          </div>
        </div>
        
        <h3 className="font-headline text-xl text-primary mt-8 mb-4">Key Capabilities:</h3>
        <ul className="list-disc list-inside space-y-3 text-foreground/90">
          <li className="flex items-start">
            <Zap className="w-5 h-5 text-accent mr-2 mt-1 shrink-0" />
            <span><strong>Visual Workflow Builder:</strong> Drag-and-drop components to design sophisticated AI agent behaviors and interactions.</span>
          </li>
          <li className="flex items-start">
            <GitBranch className="w-5 h-5 text-accent mr-2 mt-1 shrink-0" />
            <span><strong>Event Debugging & Replay:</strong> Step through agent executions, inspect state, and replay events to quickly identify and fix issues.</span>
          </li>
          <li className="flex items-start">
            <Eye className="w-5 h-5 text-accent mr-2 mt-1 shrink-0" />
            <span><strong>Live Observability & Prompt Diffing:</strong> Monitor agents in real-time, compare prompt versions, and understand the impact of changes instantly.</span>
          </li>
          <li className="flex items-start">
            <Settings className="w-5 h-5 text-accent mr-2 mt-1 shrink-0" />
            <span><strong>Agent DNA Viewer:</strong> Deep dive into the core logic and configuration of your AI agents for fine-grained control.</span>
          </li>
        </ul>
        <p className="mt-6 text-foreground/80">
          Loom Studio empowers both advanced users and AI agents themselves to collaborate in building the next generation of intelligent automation.
        </p>
      </MicroAppCard>
    </div>
  );
}
