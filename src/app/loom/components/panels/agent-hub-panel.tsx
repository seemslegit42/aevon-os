
'use client';

import { useState, useEffect, useCallback } from 'react';
import { BasePanel } from './base-panel';
import { Bot, UserPlus, Globe, MessageSquare, FileText, SendHorizonal, Loader2, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import type { ConsoleMessage, TimelineEvent } from '@/types/loom';
import { Textarea } from '@/components/ui/textarea';
import { useBeepChat } from '@/hooks/use-beep-chat';
import type { Agent, AgentType } from '@prisma/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


// Embedded Form for Webpage Summarizer
const WebpageSummarizerForm = ({ addConsoleMessage, addTimelineEvent }: { addConsoleMessage: Function, addTimelineEvent: Function }) => {
  const [url, setUrl] = useState('');
  const { append: beepAppend, isLoading: isBeepLoading } = useBeepChat();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      toast({ variant: 'destructive', title: 'URL is required.' });
      return;
    }
    addConsoleMessage('info', `Manual agent task dispatched: Summarize URL - ${url}`);
    addTimelineEvent({ type: 'info', message: 'Manual web summarization task started.' });
    beepAppend({ role: 'user', content: `Summarize the content of the webpage at this URL: ${url}` });
    
    toast({title: "Task Sent", description: "Web summarizer agent has been tasked."})
    setUrl('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Input
        type="url"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        disabled={isBeepLoading}
        className="bg-input/70 h-8"
      />
      <Button type="submit" size="sm" className="w-full text-xs" disabled={isBeepLoading}>
        {isBeepLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <FileText className="h-4 w-4 mr-2" />}
        {isBeepLoading ? 'Tasking Agent...' : 'Summarize Webpage'}
      </Button>
    </form>
  );
};

// Embedded Form for Prompt Executor
const PromptExecutorForm = ({ addConsoleMessage, addTimelineEvent }: { addConsoleMessage: Function, addTimelineEvent: Function }) => {
  const [prompt, setPrompt] = useState('');
  const { append: beepAppend, isLoading: isBeepLoading } = useBeepChat();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast({ variant: 'destructive', title: 'Prompt cannot be empty.' });
      return;
    }
    addConsoleMessage('info', `Manual agent task dispatched: Execute Prompt - "${prompt.substring(0, 50)}..."`);
    addTimelineEvent({ type: 'info', message: 'Manual prompt execution task started.' });
    beepAppend({ role: 'user', content: prompt });

    toast({title: "Prompt Sent", description: "Agent has been tasked with your prompt."})
    setPrompt('');
  };
  
  return (
     <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        placeholder="Enter a prompt for an LLM agent to execute..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        disabled={isBeepLoading}
        className="bg-input/70 text-xs min-h-[60px]"
        rows={3}
      />
      <Button type="submit" size="sm" className="w-full text-xs" disabled={isBeepLoading}>
         {isBeepLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <SendHorizonal className="h-4 w-4 mr-2" />}
         {isBeepLoading ? 'Sending to Agent...' : 'Execute Prompt'}
      </Button>
    </form>
  )
};

const agentProfiles: { name: string; type: AgentType; description: string; }[] = [
  { name: "Web Intellect Agent", type: 'WEB_INTELLECT', description: "Specializes in web search, summarization, and fact-checking." },
  { name: "Task Orchestrator Agent", type: 'TASK_ORCHESTRATOR', description: "Handles code execution, API calls, and file management." },
  { name: "Content Synthesizer Agent", type: 'CONTENT_SYNTHESIZER', description: "Generates text, images, and translations." },
  { name: "Data Cruncher Agent", type: 'DATA_CRUNCHER', description: "Focuses on data analysis, report generation, and trend identification." },
  { name: "Support Responder Agent", type: 'SUPPORT_RESPONDER', description: "Manages FAQ lookups, ticket creation, and basic chat." },
];


const statusColors: Record<string, string> = {
  active: "bg-green-500/20 text-green-400 border-green-500/50",
  idle: "bg-blue-500/20 text-blue-300 border-blue-500/50",
  error: "bg-destructive/20 text-destructive border-destructive/50",
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
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [spawnProfileIndex, setSpawnProfileIndex] = useState(0);

  const fetchAgents = useCallback(async () => {
    // No need to set loading on refetch
    try {
      const response = await fetch('/api/agents');
      if (!response.ok) throw new Error('Failed to fetch agents.');
      const data = await response.json();
      setAgents(data);
    } catch (err: any) {
      setError(err.message);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not load agent data.' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const handleSpawnAgent = async () => {
    setIsProvisioning(true);
    const profile = agentProfiles[spawnProfileIndex];
    const newAgentName = `${profile.name} #${String(Date.now()).slice(-4)}`;

    try {
        const response = await fetch('/api/agents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newAgentName, type: profile.type, description: profile.description }),
        });
        if (!response.ok) throw new Error('Failed to provision agent.');

        const newAgent = await response.json();
        setAgents(prev => [newAgent, ...prev]);
        setSpawnProfileIndex(prev => (prev + 1) % agentProfiles.length);
        addConsoleMessage('info', `Agent "${newAgent.name}" provisioned successfully.`);
        addTimelineEvent({ type: 'info', message: `New agent provisioned: ${newAgent.name}` });
        toast({ title: 'Agent Provisioned', description: `Agent "${newAgent.name}" is now online.` });
    } catch (err: any) {
        toast({ variant: 'destructive', title: 'Provisioning Failed', description: err.message });
        addConsoleMessage('error', `Failed to provision new agent.`);
    } finally {
        setIsProvisioning(false);
    }
  };

  const handleDeleteAgent = async (agentId: string) => {
    if (agentId === 'system-beep') {
        toast({ variant: 'destructive', title: 'Action Denied', description: 'The primary system agent cannot be deleted.' });
        return;
    }

    try {
        const response = await fetch(`/api/agents?id=${agentId}`, { method: 'DELETE' });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete agent.');
        }
        setAgents(prev => prev.filter(a => a.id !== agentId));
        toast({ title: 'Agent Deleted', description: 'The agent has been removed.' });
        addConsoleMessage('info', `Agent ID ${agentId} deleted.`);
    } catch (err: any) {
        toast({ variant: 'destructive', title: 'Deletion Failed', description: err.message });
    }
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
          <Button variant="outline" size="sm" className="text-xs" onClick={handleSpawnAgent} disabled={isProvisioning}>
            {isProvisioning ? <Loader2 className="h-3 w-3 mr-1.5 animate-spin"/> : <UserPlus className="h-3 w-3 mr-1.5" />}
            {isProvisioning ? 'Provisioning...' : 'Provision Agent'}
          </Button>
        </div>
        
        <ScrollArea className="pr-2 flex-grow">
          {isLoading ? (
            <div className="flex justify-center items-center h-24">
                <Loader2 className="animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-destructive text-center py-4 text-xs">
                <AlertCircle className="mx-auto h-6 w-6 mb-1" />
                {error}
            </div>
          ) : agents.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">No agents provisioned.</p>
          ) : (
            <ul className="space-y-2">
              {agents.map(agent => (
                <li key={agent.id} className="text-xs p-2 rounded-md bg-card/60 border border-border/40 flex items-center justify-between">
                  <div className="flex-1 overflow-hidden pr-2">
                    <p className="font-semibold truncate">{agent.name}</p>
                    <p className="text-muted-foreground text-[0.7rem] truncate">{agent.type}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant="outline" className={statusColors[agent.status] || statusColors.idle}>{formatStatusText(agent.status)}</Badge>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive/70 hover:text-destructive hover:bg-destructive/10" disabled={agent.id === 'system-beep'}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the agent "{agent.name}". This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteAgent(agent.id)} className="bg-destructive hover:bg-destructive/90">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      
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
