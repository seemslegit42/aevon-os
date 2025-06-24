
'use client';

import { useState, useEffect, useCallback } from 'react';
import { BasePanel } from './base-panel';
import { Bot, UserPlus, Globe, MessageSquare, Edit3, Save, XCircle, FileText, SendHorizonal, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import type { ConsoleMessage, TimelineEvent } from '@/types/loom';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import eventBus from '@/lib/event-bus';

// Embedded Form for Webpage Summarizer
const WebpageSummarizerForm = ({ addConsoleMessage, addTimelineEvent }: { addConsoleMessage: Function, addTimelineEvent: Function }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      toast({ variant: 'destructive', title: 'URL is required.' });
      return;
    }
    setIsLoading(true);
    addConsoleMessage('info', `Manual agent task dispatched: Summarize URL - ${url}`);
    addTimelineEvent({ type: 'info', message: 'Manual web summarization task started.' });
    // This event will be caught by the BEEP agent via the main chat hook
    eventBus.emit('beep:submitQuery', `Summarize the content of the webpage at this URL: ${url}`);
    
    // The result will be handled by the event listener in `page.tsx`, which updates the node.
    // For manual tasks like this, we just need a timeout to reset the UI.
    setTimeout(() => {
        setIsLoading(false);
        setUrl('');
        toast({title: "Task Sent", description: "Web summarizer agent has been tasked."})
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Input
        type="url"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        disabled={isLoading}
        className="bg-input/70 h-8"
      />
      <Button type="submit" size="sm" className="w-full text-xs" disabled={isLoading}>
        {isLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <FileText className="h-4 w-4 mr-2" />}
        {isLoading ? 'Tasking Agent...' : 'Summarize Webpage'}
      </Button>
    </form>
  );
};

// Embedded Form for Prompt Executor
const PromptExecutorForm = ({ addConsoleMessage, addTimelineEvent }: { addConsoleMessage: Function, addTimelineEvent: Function }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast({ variant: 'destructive', title: 'Prompt cannot be empty.' });
      return;
    }
    setIsLoading(true);
    addConsoleMessage('info', `Manual agent task dispatched: Execute Prompt - "${prompt.substring(0, 50)}..."`);
    addTimelineEvent({ type: 'info', message: 'Manual prompt execution task started.' });
    eventBus.emit('beep:submitQuery', prompt);

    setTimeout(() => {
        setIsLoading(false);
        setPrompt('');
        toast({title: "Prompt Sent", description: "Agent has been tasked with your prompt."})
    }, 2000);
  };
  
  return (
     <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        placeholder="Enter a prompt for an LLM agent to execute..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        disabled={isLoading}
        className="bg-input/70 text-xs min-h-[60px]"
        rows={3}
      />
      <Button type="submit" size="sm" className="w-full text-xs" disabled={isLoading}>
         {isLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <SendHorizonal className="h-4 w-4 mr-2" />}
         {isLoading ? 'Sending to Agent...' : 'Execute Prompt'}
      </Button>
    </form>
  )
};


interface Agent {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'error' | 'paused';
  tasks: number;
  permissions: string;
  workload: string;
}

const initialAgents: Agent[] = [];

const agentProfiles = [
  { namePrefix: "Web Intellect Agent", permissions: "Web Search, Summarization, Fact Checking", baseWorkload: "10%" },
  { namePrefix: "Task Orchestrator Agent", permissions: "Code Execution, API Calls, File Management", baseWorkload: "5%" },
  { namePrefix: "Content Synthesizer Agent", permissions: "Text Generation, Image Generation, Translation", baseWorkload: "15%" },
  { namePrefix: "Data Cruncher Agent", permissions: "Data Analysis, Report Generation, Trend Identification", baseWorkload: "8%" },
  { namePrefix: "Support Responder Agent", permissions: "FAQ Lookup, Ticket Creation, Basic Chat", baseWorkload: "12%" },
];


const statusColors: Record<Agent['status'], string> = {
  active: "bg-green-500/20 text-green-400 border-green-500/50",
  idle: "bg-blue-500/20 text-blue-300 border-blue-500/50",
  error: "bg-destructive/20 text-destructive border-destructive/50",
  paused: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50",
};

const formatStatusText = (status: string) => {
  if (!status) return '';
  return status.charAt(0).toUpperCase() + status.slice(1);
};

interface AgentHubPanelProps {
  className?: string;
  onClose?: () => void;
  isMobile?: boolean;
  addConsoleMessage: (type: ConsoleMessage['type'], text: string) => void;
  addTimelineEvent: (event: Omit<TimelineEvent, 'id' | 'timestamp'>) => void;
}

export function AgentHubPanel({
  className,
  onClose,
  isMobile,
  addConsoleMessage,
  addTimelineEvent,
}: AgentHubPanelProps) {
  const { toast } = useToast();
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [editableAgentName, setEditableAgentName] = useState('');
  const [editableAgentPermissions, setEditableAgentPermissions] = useState('');
  const [spawnProfileIndex, setSpawnProfileIndex] = useState(0);

  useEffect(() => {
    // In a real app, you would fetch agents from a backend API.
  }, []);

  useEffect(() => {
    if (selectedAgent) {
      setEditableAgentName(selectedAgent.name);
      setEditableAgentPermissions(selectedAgent.permissions);
    } else {
      setEditableAgentName('');
      setEditableAgentPermissions('');
    }
  }, [selectedAgent]);

  const handleSelectAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    addConsoleMessage('log', `Agent "${agent.name}" selected for configuration.`);
  };

  const handleUpdateAgent = () => {
    if (!selectedAgent) return;
    toast({ title: "Agent Update Requested", description: `This is a mock-up. In a real app, this would update agent "${editableAgentName}" on the backend.` });
    addConsoleMessage('info', `User requested update for agent "${editableAgentName}". Backend call is mocked.`);
    setSelectedAgent(null);
  };

  const handleCancelEdit = () => {
    setSelectedAgent(null);
    addConsoleMessage('log', `Agent configuration cancelled.`);
  };


  const handleSpawnAgent = () => {
    const profile = agentProfiles[spawnProfileIndex];
    const newAgentName = `${profile.namePrefix} #${Date.now().toString().slice(-4)}`;
    setSpawnProfileIndex((prevIndex) => (prevIndex + 1) % agentProfiles.length);
    toast({ title: "Agent Provisioning Mocked", description: `A new agent "${newAgentName}" would be provisioned now.` });
    addConsoleMessage('info', `User requested provisioning of new agent: "${newAgentName}". This is a mock action.`);
    addTimelineEvent({ type: 'info', message: `Mock agent provisioning requested for "${newAgentName}".` });
  };

  const handleResumeAll = () => {
    toast({ title: "Agent Hub Action", description: "Mock action: Resuming all agents." });
    addConsoleMessage('info', 'Agent Hub: Mock action to resume all agents triggered.');
    addTimelineEvent({ type: 'info', message: 'Resume all agents action requested (mock).' });
  };

  const handlePauseAll = () => {
    toast({ title: "Agent Hub Action", description: "Mock action: Pausing all agents.", variant: "secondary" });
    addConsoleMessage('warn', 'Agent Hub: Mock action to pause all agents triggered.');
    addTimelineEvent({ type: 'info', message: 'Pause all agents action requested (mock).' });
  };

  const handleToggleAgentStatus = (agentId: string) => {
    const agentToToggle = agents.find(a => a.id === agentId);
    if (!agentToToggle) return;
    const action = (agentToToggle.status === 'active') ? 'pause' : 'resume';
    toast({ title: `Agent Status Change Mocked`, description: `Agent "${agentToToggle.name}" would now be ${action}d.` });
    addConsoleMessage('info', `User requested to ${action} agent "${agentToToggle.name}". Mock action.`);
  };


  return (
    <BasePanel
      title="Agent Hub"
      icon={<Bot className="h-4 w-4" />}
      className={className}
      onClose={onClose}
      contentClassName="space-y-3 flex flex-col"
    >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Managed Agents ({agents.length})</h3>
          <Button variant="outline" size="sm" className="text-xs" onClick={handleSpawnAgent}>
            <UserPlus className="h-3 w-3 mr-1.5" />
            Provision Agent
          </Button>
        </div>
        
        <ScrollArea className="pr-2 h-24"> 
          {agents.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">No agents provisioned. Provision one to see it here.</p>
          ) : (
            <ul className="space-y-2">
              {/* Agent list would be rendered here */}
            </ul>
          )}
        </ScrollArea>
      
      {selectedAgent && (
        <>
          <Separator className="my-2" />
          <div className="space-y-3 p-2.5 border border-dashed border-border/50 rounded-md bg-card/40">
            <h4 className="text-sm font-medium flex items-center gap-1.5 text-primary">
              <Edit3 className="h-4 w-4" /> Configure Agent: {selectedAgent.name}
            </h4>
            <div className="space-y-1">
              <Label htmlFor="agentNameEdit" className="text-xs">Agent Name</Label>
              <Input id="agentNameEdit" value={editableAgentName} onChange={(e) => setEditableAgentName(e.target.value)} className="bg-input/70 h-8" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="agentPermissionsEdit" className="text-xs">Agent Capabilities</Label>
              <Input id="agentPermissionsEdit" value={editableAgentPermissions} onChange={(e) => setEditableAgentPermissions(e.target.value)} className="bg-input/70 h-8" />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Button onClick={handleUpdateAgent} size="sm" className="flex-1 text-xs"><Save className="h-3.5 w-3.5 mr-1.5" /> Save</Button>
              <Button onClick={handleCancelEdit} variant="outline" size="sm" className="flex-1 text-xs"><XCircle className="h-3.5 w-3.5 mr-1.5" /> Cancel</Button>
            </div>
          </div>
        </>
      )}

      <Separator className="my-3" />

      <div className="space-y-3">
        <h3 className="text-sm font-medium flex items-center gap-1.5">
          <Globe className="h-4 w-4 text-primary/80" /> Manual Web Task
        </h3>
        <WebpageSummarizerForm addConsoleMessage={addConsoleMessage} addTimelineEvent={addTimelineEvent} />
      </div>

      <Separator className="my-3" />

      <div className="space-y-3">
        <h3 className="text-sm font-medium flex items-center gap-1.5">
          <MessageSquare className="h-4 w-4 text-primary/80" /> Manual Prompt Task
        </h3>
        <PromptExecutorForm addConsoleMessage={addConsoleMessage} addTimelineEvent={addTimelineEvent} />
      </div>
    </BasePanel>
  );
}
