
'use client';

import { useState, useEffect, useCallback } from 'react';
import { CanvasZone } from '@/app/loom/components/canvas/canvas-zone';
import { PalettePanel } from '@/app/loom/components/panels/palette-panel';
import { InspectorPanel } from '@/app/loom/components/panels/inspector-panel';
import { TimelinePanel } from '@/app/loom/components/panels/timeline-panel';
import { ConsolePanel } from '@/app/loom/components/panels/console-panel';
import { AgentHubPanel } from '@/app/loom/components/panels/agent-hub-panel';
import { ActionConsolePanel } from '@/app/loom/components/panels/action-console-panel';
import { TemplateSelectorDialog } from '@/app/loom/components/panels/template-selector-dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { ResizableHorizontalPanes } from '@/app/loom/components/layout/resizable-horizontal-panes';
import { ResizableVerticalPanes } from '@/app/loom/components/layout/resizable-vertical-panes';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useBeepChat } from '@/hooks/use-beep-chat';
import eventBus from '@/lib/event-bus';
import { exampleTemplates } from '@/app/loom/data/templates';
import { useLoomStore } from '@/stores/loom.store';
import { cn } from '@/lib/utils';
import { shallow } from 'zustand/shallow';
import { BottomBar } from './components/layout/bottom-bar';

import type {
  WorkflowNodeData,
  NodeStatus,
  PanelVisibility,
  ConnectingState,
  AiGeneratedFlowData,
  ConsoleMessage,
  TimelineEvent,
  WorkflowTemplate,
  Connection,
  WebSummarizerResult,
} from '@/types/loom';


export default function LoomStudioPage() {
  // Centralized state from Zustand store
  const {
    nodes, connections, selectedNodeId, consoleMessages, timelineEvents, actionRequests,
    workflowName, nodeExecutionStatus,
    setWorkflow, setSelectedNodeId, updateNode, deleteNode, addNode, addConnection,
    clearWorkflow, addConsoleMessage, addTimelineEvent, updateActionRequestStatus, clearConsole,
    setNodeExecutionStatus, updateNodeStatus,
  } = useLoomStore(state => ({...state}), shallow);

  // Local UI state
  const [connectingState, setConnectingState] = useState<ConnectingState | null>(null);
  const [panelVisibility, setPanelVisibility] = useState<PanelVisibility>({
    palette: true,
    inspector: true,
    timeline: true,
    console: true,
    agentHub: true,
    actionConsole: true,
  });
  const [consoleFilters, setConsoleFilters] = useState<Record<ConsoleMessage['type'], boolean>>({
    info: true,
    log: true,
    warn: true,
    error: true,
  });
  const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = useState(false);

  const { append: beepAppend } = useBeepChat();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const selectedNode = nodes.find(n => n.id === selectedNodeId) || null;

  useEffect(() => {
    addConsoleMessage('info', 'Loom Studio Initialized. AI is standing by to generate workflows.');
    
    const openTemplateHandler = () => setIsTemplateSelectorOpen(true);
    eventBus.on('loom:open-templates', openTemplateHandler);
    
    return () => {
      eventBus.off('loom:open-templates', openTemplateHandler);
    };
  }, [addConsoleMessage]);

  const visualizeWorkflowExecution = useCallback((flow: AiGeneratedFlowData) => {
    if (!flow || flow.nodes.length === 0 || !flow.workflowName) {
        addConsoleMessage('warn', 'No workflow or nodes available to visualize.');
        return;
    }

    addConsoleMessage('info', `Workflow "${flow.workflowName}" initialized for display on canvas.`);
    addTimelineEvent({ type: 'workflow_start', message: `Workflow "${flow.workflowName}" displayed.` });

    const initialStatuses: Record<string, NodeStatus> = {};
    flow.nodes.forEach(node => {
      initialStatuses[node.id] = 'queued';
      addTimelineEvent({ nodeId: node.id, nodeTitle: node.title, type: 'node_queued', message: `Node "${node.title}" set to 'queued'.` });
    });
    setNodeExecutionStatus(initialStatuses);
    addConsoleMessage('info', `Workflow "${flow.workflowName}" node statuses initialized to 'queued'.`);
  }, [addConsoleMessage, addTimelineEvent, setNodeExecutionStatus]);

  const handleFlowGenerated = useCallback((data: AiGeneratedFlowData) => {
    setSelectedNodeId(null);
    if (data.error || !data.workflowName || data.nodes.length === 0) {
      addConsoleMessage('error', `Failed to generate flow: ${data.message || 'AI returned an empty or invalid workflow.'}`);
      clearWorkflow();
    } else {
      addConsoleMessage('info', `Flow "${data.workflowName}" generated with ${data.nodes.length} steps. Preparing for display...`);
      const idMap: Record<string, string> = {};
      const newNodes: WorkflowNodeData[] = data.nodes.map((node, index) => {
          const newNodeId = `ai-${node.title.toLowerCase().replace(/ /g, '-')}-${Date.now()}-${index}`;
          idMap[node.localId!] = newNodeId;
          return { ...node, id: newNodeId, status: 'queued' };
      });
      const newConnections: Connection[] = (data.connections || []).map((conn, index) => ({
          id: `conn-ai-${Date.now()}-${index}`,
          from: idMap[conn.fromLocalId],
          to: idMap[conn.toLocalId],
      })).filter(c => c.from && c.to);
      
      setWorkflow({ nodes: newNodes, connections: newConnections, workflowName: data.workflowName });
      visualizeWorkflowExecution({ ...data, nodes: newNodes });
    }
  }, [addConsoleMessage, visualizeWorkflowExecution, setWorkflow, clearWorkflow, setSelectedNodeId]);

  useEffect(() => {
    eventBus.on('loom:flow-generated', handleFlowGenerated);
    return () => {
      eventBus.off('loom:flow-generated', handleFlowGenerated);
    };
  }, [handleFlowGenerated]);
  
  useEffect(() => {
    const handleSummarizerResult = (result: WebSummarizerResult) => {
        addConsoleMessage('info', `Web summarizer finished for URL: ${result.originalUrl}`);
        const runningNode = nodes.find(n => nodeExecutionStatus[n.id] === 'running' && n.type === 'web-summarizer');
        if (runningNode) {
            updateNode(runningNode.id, {
                status: 'completed',
                config: { ...runningNode.config, output: result }
            });
            updateNodeStatus(runningNode.id, 'completed');
            addTimelineEvent({
                type: 'node_completed',
                message: `Web summarization successful.`,
                nodeId: runningNode.id,
                nodeTitle: runningNode.title,
            });
        }
    };
    eventBus.on('websummarizer:result', handleSummarizerResult);
    return () => { eventBus.off('websummarizer:result', handleSummarizerResult); };
  }, [addConsoleMessage, nodes, nodeExecutionStatus, updateNode, addTimelineEvent, updateNodeStatus]);

  useEffect(() => {
    const handleNodeResult = (result: { content: string }) => {
        addConsoleMessage('info', `Received generic text result for running node.`);
        const runningNode = nodes.find(n => 
            nodeExecutionStatus[n.id] === 'running' && 
            (n.type === 'prompt' || n.type === 'agent-call')
        );
        if (runningNode) {
            updateNode(runningNode.id, {
                status: 'completed',
                config: { ...runningNode.config, output: { result: result.content } }
            });
            updateNodeStatus(runningNode.id, 'completed');
            addTimelineEvent({
                type: 'node_completed',
                message: `Node finished successfully.`,
                nodeId: runningNode.id,
                nodeTitle: runningNode.title,
            });
        }
    };
    eventBus.on('loom:node-result', handleNodeResult);
    return () => { eventBus.off('loom:node-result', handleNodeResult); };
  }, [addConsoleMessage, nodes, nodeExecutionStatus, updateNode, addTimelineEvent, updateNodeStatus]);


  const handleNodeDropped = (newNodeData: Omit<WorkflowNodeData, 'id' | 'status'> & { status?: NodeStatus }) => {
    if (nodes.length === 0) {
      addConsoleMessage('info', `New custom workflow "${workflowName}" started by user adding node.`);
      addTimelineEvent({ type: 'workflow_start', message: `Custom workflow "${workflowName}" started.`});
    }
    const newNode = addNode(newNodeData);
    setSelectedNodeId(newNode.id);
    addConsoleMessage('log', `Node "${newNode.title}" (ID: ${newNode.id}) added to canvas.`);
    addTimelineEvent({
      nodeId: newNode.id,
      nodeTitle: newNode.title,
      type: 'node_queued',
      message: `Manual Node "${newNode.title}" added and queued.`
    });
  };

  const handleNodeSelected = (node: WorkflowNodeData | null) => {
    setSelectedNodeId(node ? node.id : null);
    if (node) {
      setConnectingState(null);
      addConsoleMessage('log', `Node "${node.title}" (ID: ${node.id}) selected.`);
    } else if (connectingState) {
      addConsoleMessage('info', `Connection attempt cancelled.`);
      setConnectingState(null);
    }
  };

  const handleNodeUpdate = (updatedNodeData: WorkflowNodeData) => {
    updateNode(updatedNodeData.id, updatedNodeData);
    toast({ title: "Node Updated", description: `Node "${updatedNodeData.title}" has been saved.` });
    addConsoleMessage('info', `Node "${updatedNodeData.title}" (ID: ${updatedNodeData.id}) updated.`);
  };

  const handleDeleteNode = (nodeId: string) => {
    const nodeToDelete = nodes.find(n => n.id === nodeId);
    if (nodeToDelete) {
      deleteNode(nodeId);
      addConsoleMessage('info', `Node "${nodeToDelete.title}" (ID: ${nodeId}) and connections deleted.`);
      addTimelineEvent({ type: 'info', message: `Node "${nodeToDelete.title}" deleted.`});
      toast({ title: "Node Deleted", description: `Node "${nodeToDelete.title}" has been removed.`});
    }
  };

  const handleRunNode = useCallback(async (nodeId: string) => {
    const nodeToRun = nodes.find(n => n.id === nodeId);
    if (!nodeToRun) return;

    if (nodeToRun.config?.beepEmotion) eventBus.emit('beep:setEmotion', nodeToRun.config.beepEmotion);

    updateNodeStatus(nodeId, 'running');
    addTimelineEvent({ type: 'node_running', message: `Executing node: ${nodeToRun.title}`, nodeId, nodeTitle: nodeToRun.title });
    
    let prompt = '';
    switch (nodeToRun.type) {
      case 'web-summarizer':
        prompt = `Please summarize the content from this URL: ${nodeToRun.config?.url}`;
        break;
      case 'prompt':
      case 'agent-call':
        prompt = nodeToRun.config?.promptText || `Execute generic prompt for node ${nodeToRun.title}`;
        break;
      default:
        toast({ title: "Execution Not Implemented", description: `Backend for '${nodeToRun.type}' is not yet implemented.`});
        addConsoleMessage('warn', `Execution for node type '${nodeToRun.type}' is not implemented. Faking failure.`);
        setTimeout(() => updateNodeStatus(nodeId, 'failed'), 1500);
        return;
    }
    if (prompt) {
      addConsoleMessage('info', `Dispatching task to BEEP for node "${nodeToRun.title}": ${prompt}`);
      beepAppend({ role: 'user', content: prompt });
    }
  }, [nodes, addConsoleMessage, addTimelineEvent, toast, beepAppend, updateNodeStatus]);

  const isNodeRunning = (nodeId: string): boolean => nodeExecutionStatus[nodeId] === 'running';

  const togglePanel = (panel: keyof PanelVisibility) => {
    setPanelVisibility(prev => {
      const newState = { ...prev };
      if (isMobile) {
        const wasOpen = prev[panel];
        Object.keys(newState).forEach(k => newState[k as keyof PanelVisibility] = false);
        newState[panel] = !wasOpen;
      } else {
        newState[panel] = !prev[panel];
      }
      return newState;
    });
  };
  
  const handleOutputPortClick = (nodeId: string, portElement: HTMLDivElement) => {
    addConsoleMessage('log', `Output port clicked on node ${nodeId}. Waiting for input port selection.`);
    setConnectingState({ fromNodeId: nodeId, fromPortElement: portElement });
    setSelectedNodeId(nodeId);
  };

  const handleInputPortClick = (nodeId: string) => {
    if (!connectingState) return;
    if (connectingState.fromNodeId === nodeId) {
      addConsoleMessage('warn', "Cannot connect a node to itself.");
      toast({title: "Connection Error", description: "Cannot connect a node to itself.", variant: "destructive"});
      setConnectingState(null);
      return;
    }
    addConnection(connectingState.fromNodeId, nodeId);
    setConnectingState(null);
  };
  
  const handleLoadTemplate = useCallback((template: WorkflowTemplate) => {
    addConsoleMessage('info', `Loading template: "${template.name}"`);
    clearWorkflow();
    handleFlowGenerated({ 
        workflowName: template.name, 
        nodes: template.nodes, 
        connections: template.connections,
        message: 'Template loaded successfully.',
        error: false,
    });
    setIsTemplateSelectorOpen(false);
    toast({ title: "Template Loaded", description: `Workflow "${template.name}" is ready.` });
  }, [addConsoleMessage, clearWorkflow, handleFlowGenerated, toast]);

  const handleAgentActionResponse = (requestId: string, responseStatus: 'approved' | 'denied' | 'responded', details?: string) => {
    addConsoleMessage('info', `User responded to action request ${requestId} with status: ${responseStatus}`);
    updateActionRequestStatus(requestId, responseStatus, details);
    // TODO: In a real implementation, this would send a message back to the AI agent.
    toast({ title: 'Response Sent (Mock)', description: `Your response '${responseStatus}' has been logged.`})
  };

  const anyMobilePanelOpen = isMobile && Object.values(panelVisibility).some(v => v);

  if (isMobile) {
    return (
      <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
        <main className={`flex-1 relative flex overflow-hidden p-0 pb-16`}>
           <div className={`flex-1 h-full transition-opacity duration-300 ${anyMobilePanelOpen ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
              <CanvasZone {...{workflowName, nodes, connections, onNodeDropped: handleNodeDropped, selectedNode, onNodeSelected: handleNodeSelected, nodeExecutionStatus, onInputPortClick: handleInputPortClick, onOutputPortClick: handleOutputPortClick, connectingState}} />
           </div>
           {Object.entries(panelVisibility).map(([panelKey, isVisible]) => (
                <div key={panelKey} className={cn(`fixed inset-y-0 z-40 w-4/5 max-w-sm bg-card/90 backdrop-blur-lg shadow-2xl transform transition-transform duration-300 ease-in-out`, {
                    'left-0': ['palette'].includes(panelKey),
                    'right-0': ['inspector', 'agentHub', 'actionConsole'].includes(panelKey),
                    'translate-x-0': isVisible,
                    '-translate-x-full': !isVisible && ['palette'].includes(panelKey),
                    'translate-x-full': !isVisible && ['inspector', 'agentHub', 'actionConsole'].includes(panelKey),
                    'bottom-0 h-3/5 mb-14': ['timeline', 'console'].includes(panelKey),
                    'translate-y-full': !isVisible && ['timeline', 'console'].includes(panelKey),
                })}>
                    {isVisible && (
                       <>
                        {panelKey === 'palette' && <PalettePanel className="h-full" onClose={() => togglePanel('palette')} />}
                        {panelKey === 'inspector' && <TooltipProvider delayDuration={300}><InspectorPanel key={selectedNode?.id || 'inspector-mobile-empty'} className="h-full overflow-y-auto" onClose={() => togglePanel('inspector')} {...{selectedNode, onNodeUpdate: handleNodeUpdate, onNodeDelete: handleDeleteNode, isMobile, onRunNode: handleRunNode, isNodeRunning}} /></TooltipProvider>}
                        {panelKey === 'agentHub' && <AgentHubPanel className="h-full" onClose={() => togglePanel('agentHub')} {...{addConsoleMessage, addTimelineEvent}} />}
                        {panelKey === 'actionConsole' && <ActionConsolePanel className="h-full" requests={actionRequests} onRespond={handleAgentActionResponse} onClose={() => togglePanel('actionConsole')} {...{addConsoleMessage, addTimelineEvent}} />}
                        {panelKey === 'timeline' && <TimelinePanel className="h-full" onClose={() => togglePanel('timeline')} events={timelineEvents} />}
                        {panelKey === 'console' && <ConsolePanel className="h-full" onClose={() => togglePanel('console')} messages={consoleMessages.filter(msg => consoleFilters[msg.type])} filters={consoleFilters} onToggleFilter={(type) => setConsoleFilters(f => ({ ...f, [type]: !f[type]}))} onClearConsole={clearConsole} />}
                       </>
                    )}
                </div>
            ))}
        </main>
        <BottomBar panelVisibility={panelVisibility} togglePanel={togglePanel} />
        <TemplateSelectorDialog isOpen={isTemplateSelectorOpen} onClose={() => setIsTemplateSelectorOpen(false)} templates={exampleTemplates} onLoadTemplate={handleLoadTemplate} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background text-foreground overflow-hidden">
      <main className="flex-1 p-2 flex gap-2 overflow-hidden">
        <TooltipProvider delayDuration={300}>
          <ResizableHorizontalPanes storageKey="loom-main-h-split" initialDividerPosition={20}>
            <ResizableVerticalPanes storageKey="loom-left-v-split" initialDividerPosition={50} minPaneHeight={150}>
              <PalettePanel className={cn(!panelVisibility.palette && "hidden")} onClose={() => togglePanel('palette')} />
              <AgentHubPanel className={cn(!panelVisibility.agentHub && "hidden")} onClose={() => togglePanel('agentHub')} {...{addConsoleMessage, addTimelineEvent}} />
            </ResizableVerticalPanes>
            <ResizableHorizontalPanes storageKey="loom-center-right-h-split" initialDividerPosition={75}>
              <ResizableVerticalPanes storageKey="loom-center-v-split" initialDividerPosition={70} minPaneHeight={100}>
                <CanvasZone {...{workflowName, nodes, connections, onNodeDropped: handleNodeDropped, selectedNode, onNodeSelected: handleNodeSelected, nodeExecutionStatus, onInputPortClick: handleInputPortClick, onOutputPortClick: handleOutputPortClick, connectingState}} />
                <ResizableHorizontalPanes storageKey="loom-bottom-h-split" minPaneWidth={200}>
                    <TimelinePanel className={cn(!panelVisibility.timeline && "hidden")} onClose={() => togglePanel('timeline')} events={timelineEvents} />
                    <ConsolePanel className={cn(!panelVisibility.console && "hidden")} onClose={() => togglePanel('console')} messages={consoleMessages.filter(msg => consoleFilters[msg.type])} filters={consoleFilters} onToggleFilter={(type) => setConsoleFilters(f => ({ ...f, [type]: !f[type]}))} onClearConsole={clearConsole} />
                </ResizableHorizontalPanes>
              </ResizableVerticalPanes>
              <ResizableVerticalPanes storageKey="loom-right-v-split" initialDividerPosition={65} minPaneHeight={150}>
                 <InspectorPanel key={selectedNode?.id || 'inspector-empty'} className={cn(!panelVisibility.inspector && "hidden")} onClose={() => togglePanel('inspector')} {...{selectedNode, onNodeUpdate: handleNodeUpdate, onNodeDelete: handleDeleteNode, onRunNode: handleRunNode, isNodeRunning}} />
                 <ActionConsolePanel className={cn(!panelVisibility.actionConsole && "hidden")} onClose={() => togglePanel('actionConsole')} requests={actionRequests} onRespond={handleAgentActionResponse} {...{addConsoleMessage, addTimelineEvent}} />
              </ResizableVerticalPanes>
            </ResizableHorizontalPanes>
          </ResizableHorizontalPanes>
        </TooltipProvider>
        <TemplateSelectorDialog isOpen={isTemplateSelectorOpen} onClose={() => setIsTemplateSelectorOpen(false)} templates={exampleTemplates} onLoadTemplate={handleLoadTemplate} />
      </main>
    </div>
  );
}
