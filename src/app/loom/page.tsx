
// src/app/loom/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { TopBar } from '@/app/loom/components/layout/top-bar';
import { BottomBar } from '@/app/loom/components/layout/bottom-bar';
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
import { generateNodeId } from '@/lib/utils';
import { ResizableHorizontalPanes } from '@/app/loom/components/layout/resizable-horizontal-panes';
import { ResizableVerticalPanes } from '@/app/loom/components/layout/resizable-vertical-panes';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useBeepChat } from '@/hooks/use-beep-chat';
import eventBus from '@/lib/event-bus';
import { exampleTemplates } from '@/app/loom/data/templates';
import { useLoomStore } from '@/stores/loom.store';
import { cn } from '@/lib/utils';

import type {
  WorkflowNodeData,
  NodeStatus,
  PanelVisibility,
  ConnectingState,
  AiGeneratedFlowData,
  ActionRequest,
  ConsoleMessage,
  TimelineEvent,
  WorkflowTemplate,
  Connection,
  WebSummarizerResult,
} from '@/types/loom';


const initialActionRequests: ActionRequest[] = [];


export default function LoomStudioPage() {
  const { nodes, connections, selectedNodeId, setWorkflow, setSelectedNodeId, updateNode, deleteNode, addNode, addConnection, clearWorkflow } = useLoomStore();

  const [connectingState, setConnectingState] = useState<ConnectingState | null>(null);
  const [panelVisibility, setPanelVisibility] = useState<PanelVisibility>({
    palette: true,
    inspector: true,
    timeline: true,
    console: true,
    agentHub: true,
    actionConsole: true,
  });
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [nodeExecutionStatus, setNodeExecutionStatus] = useState<Record<string, NodeStatus>>({});
  const [consoleFilters, setConsoleFilters] = useState<Record<ConsoleMessage['type'], boolean>>({
    info: true,
    log: true,
    warn: true,
    error: true,
  });
  const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = useState(false);
  const [actionRequests, setActionRequests] = useState<ActionRequest[]>(initialActionRequests);
  const [workflowName, setWorkflowName] = useState<string | undefined>('Untitled Flow');

  const { append: beepAppend } = useBeepChat();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const selectedNode = nodes.find(n => n.id === selectedNodeId) || null;

  const addConsoleMessage = useCallback((type: ConsoleMessage['type'], text: string) => {
    const newMessage: ConsoleMessage = { type, text, timestamp: new Date() };
    setConsoleMessages(prev => [newMessage, ...prev.slice(0, 199)]);
  }, []);

  const addTimelineEvent = useCallback((event: Omit<TimelineEvent, 'id' | 'timestamp'>) => {
    setTimelineEvents(prev => [{ ...event, id: crypto.randomUUID(), timestamp: new Date() }, ...prev.slice(0, 49)]);
  }, []);

  useEffect(() => {
    addConsoleMessage('info', 'Loom Studio Initialized. AI is standing by to generate workflows.');
  }, [addConsoleMessage]);

  useEffect(() => {
    const handleSummarizerResult = (result: WebSummarizerResult) => {
        addConsoleMessage('info', `Web summarizer finished for URL: ${result.originalUrl}`);
        const runningNode = nodes.find(n => nodeExecutionStatus[n.id] === 'running' && n.type === 'web-summarizer');
        
        if (runningNode) {
            updateNode(runningNode.id, {
                status: 'completed',
                config: { ...runningNode.config, output: result }
            });
            setNodeExecutionStatus(prev => ({ ...prev, [runningNode.id]: 'completed' }));
        }
    };

    const handleSummarizerError = (error: string) => {
        addConsoleMessage('error', `Web summarizer failed: ${error}`);
        const runningNode = nodes.find(n => nodeExecutionStatus[n.id] === 'running' && n.type === 'web-summarizer');
        if (runningNode) {
            updateNode(runningNode.id, {
                status: 'failed',
                config: { ...runningNode.config, output: { error } }
            });
            setNodeExecutionStatus(prev => ({ ...prev, [runningNode.id]: 'failed' }));
        }
    }

    eventBus.on('websummarizer:result', handleSummarizerResult);
    eventBus.on('websummarizer:error', handleSummarizerError);

    return () => {
        eventBus.off('websummarizer:result', handleSummarizerResult);
        eventBus.off('websummarizer:error', handleSummarizerError);
    }
  }, [addConsoleMessage, nodes, nodeExecutionStatus, updateNode]);


  const handleAgentActionResponse = useCallback((requestId: string, responseStatus: 'approved' | 'denied' | 'responded', details?: string) => {
    const request = actionRequests.find(r => r.id === requestId);
    if (!request) return;

    const logMessage = `Agent Action: Request ID ${requestId} (${request.requestType} from ${request.agentName}) was ${responseStatus}. ${details ? `Details: "${details}"` : ''}.`;
    addConsoleMessage('info', logMessage);
    addTimelineEvent({ type: 'info', message: `User ${responseStatus} agent action: ${request.agentName}.` });

    toast({
      title: `Agent Action ${responseStatus.charAt(0).toUpperCase() + responseStatus.slice(1)}`,
      description: `Request from ${request.agentName} has been marked ${responseStatus}.`,
    });
  }, [actionRequests, addConsoleMessage, addTimelineEvent, toast]);


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

  }, [addConsoleMessage, addTimelineEvent]);


  const handleFlowGenerated = useCallback((data: AiGeneratedFlowData) => {
    setSelectedNodeId(null);

    if (data.error || !data.workflowName || data.nodes.length === 0) {
        addConsoleMessage('error', `Failed to generate flow: ${data.message || 'AI returned an empty or invalid workflow.'}`);
        clearWorkflow();
        setTimelineEvents([]);
        setNodeExecutionStatus({});
    } else {
        addConsoleMessage('info', `Flow "${data.workflowName}" generated with ${data.nodes.length} steps. Preparing for display...`);
        const idMap: Record<string, string> = {};
        const newNodes: WorkflowNodeData[] = data.nodes.map((node, index) => {
            const newNodeId = generateNodeId('ai', node.title, `${Date.now()}-${index}`);
            idMap[node.localId!] = newNodeId;
            return { ...node, id: newNodeId, status: 'queued', position: node.position };
        });

        const newConnections: Connection[] = (data.connections || []).map((conn, index) => ({
            id: `conn-ai-${Date.now()}-${index}`,
            from: idMap[conn.fromLocalId],
            to: idMap[conn.toLocalId],
        })).filter(c => c.from && c.to); // Filter out invalid connections
        
        setWorkflow({ nodes: newNodes, connections: newConnections });
        setWorkflowName(data.workflowName);
        visualizeWorkflowExecution({ ...data, nodes: newNodes });
    }
  }, [addConsoleMessage, visualizeWorkflowExecution, setWorkflow, clearWorkflow, setSelectedNodeId]);

  const handleNodeDropped = (newNodeData: Omit<WorkflowNodeData, 'id' | 'status'> & { status?: NodeStatus }) => {
    const newNode = addNode(newNodeData);
    
    if (nodes.length === 0) {
        addConsoleMessage('info', `New custom workflow "${workflowName}" started by user adding node: "${newNode.title}".`);
        addTimelineEvent({ type: 'workflow_start', message: `Custom workflow "${workflowName}" started.`});
    }

    setSelectedNodeId(newNode.id);
    addConsoleMessage('log', `Node "${newNode.title}" (ID: ${newNode.id}) added to canvas.`);
    setNodeExecutionStatus(prev => ({...prev, [newNode.id]: 'queued' }));
    addTimelineEvent({
      nodeId: newNode.id,
      nodeTitle: newNode.title,
      type: 'node_queued',
      message: `Manual Node "${newNode.title}" added and queued.`
    });
  };

  const handleNodeSelected = (node: WorkflowNodeData | null) => {
    if (node) {
      setSelectedNodeId(node.id);
      setConnectingState(null);
      addConsoleMessage('log', `Node "${node.title}" (ID: ${node.id}) selected.`);
    } else {
      if (connectingState) {
        addConsoleMessage('info', `Connection attempt cancelled by clicking canvas background.`);
      }
      setSelectedNodeId(null);
      setConnectingState(null);
    }
  };

  const handleNodeUpdate = (updatedNodeData: WorkflowNodeData) => {
    updateNode(updatedNodeData.id, updatedNodeData);
    toast({ title: "Node Updated", description: `Node "${updatedNodeData.title}" has been saved.` });
    addConsoleMessage('info', `Node "${updatedNodeData.title}" (ID: ${updatedNodeData.id}) updated.`);

    const oldStatus = nodeExecutionStatus[updatedNodeData.id];
    if (updatedNodeData.status && oldStatus !== updatedNodeData.status) {
      setNodeExecutionStatus(prev => ({...prev, [updatedNodeData.id]: updatedNodeData.status! }));
      const eventTypeMap: Partial<Record<NodeStatus, TimelineEvent['type']>> = {
        completed: 'node_completed', running: 'node_running', failed: 'node_failed', queued: 'node_queued',
      };
      addTimelineEvent({
        nodeId: updatedNodeData.id, nodeTitle: updatedNodeData.title,
        type: eventTypeMap[updatedNodeData.status!] || 'info',
        message: `Node "${updatedNodeData.title}" status manually updated to ${updatedNodeData.status}.`
      });
    }
  };

  const handleDeleteNode = (nodeId: string) => {
    const nodeToDelete = nodes.find(n => n.id === nodeId);
    if (!nodeToDelete) return;

    deleteNode(nodeId);
    
    addConsoleMessage('info', `Node "${nodeToDelete.title}" (ID: ${nodeId}) and connections deleted.`);
    addTimelineEvent({ type: 'info', message: `Node "${nodeToDelete.title}" deleted.`});
    toast({ title: "Node Deleted", description: `Node "${nodeToDelete.title}" has been removed.`});
  };

  const handleRunNode = useCallback(async (nodeId: string) => {
    const nodeToRun = nodes.find(n => n.id === nodeId);
    if (!nodeToRun) {
      addConsoleMessage('error', `Attempted to run non-existent node ID: ${nodeId}`);
      return;
    }

    if (nodeToRun.config?.beepEmotion) {
        eventBus.emit('beep:setEmotion', nodeToRun.config.beepEmotion);
    }

    setNodeExecutionStatus(prev => ({ ...prev, [nodeId]: 'running' }));
    addTimelineEvent({ type: 'node_running', message: `Executing node: ${nodeToRun.title}`, nodeId, nodeTitle: nodeToRun.title });
    
    let prompt = '';
    switch (nodeToRun.type) {
        case 'web-summarizer':
            prompt = `Please summarize the content from this URL: ${nodeToRun.config?.url}`;
            break;
        case 'prompt':
            prompt = nodeToRun.config?.promptText || `Execute generic prompt for node ${nodeToRun.title}`;
            break;
        default:
            toast({ title: "Execution Not Implemented", description: `Backend for '${nodeToRun.type}' is not yet implemented.`});
            addConsoleMessage('warn', `Execution for node type '${nodeToRun.type}' is not implemented. Faking failure.`);
            setTimeout(() => setNodeExecutionStatus(prev => ({ ...prev, [nodeId]: 'failed' })), 1500);
            return;
    }

    if (prompt) {
        addConsoleMessage('info', `Dispatching task to BEEP for node "${nodeToRun.title}": ${prompt}`);
        beepAppend({ role: 'user', content: prompt });
    }
  }, [nodes, addConsoleMessage, addTimelineEvent, toast, beepAppend]);

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

  const closeAllMobilePanels = () => {
    if (isMobile) {
      setPanelVisibility({ palette: false, inspector: false, timeline: false, console: false, agentHub: false, actionConsole: false });
    }
  };

  const toggleConsoleFilter = (type: ConsoleMessage['type']) => {
    setConsoleFilters(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const handleClearConsole = () => {
    setConsoleMessages([{ type: 'info', text: 'Local console view cleared.', timestamp: new Date() }]);
    toast({ title: "Console Cleared" });
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
    if (connections.some(c => c.from === connectingState.fromNodeId && c.to === nodeId)) {
      addConsoleMessage('warn', `Connection from ${connectingState.fromNodeId} to ${nodeId} already exists.`);
      setConnectingState(null);
      return;
    }

    addConnection(connectingState.fromNodeId, nodeId);
    
    const fromNodeTitle = nodes.find(n=>n.id===connectingState.fromNodeId)?.title || 'source';
    const toNodeTitle = nodes.find(n=>n.id===nodeId)?.title || 'target';
    addConsoleMessage('info', `Connected ${fromNodeTitle} to ${toNodeTitle}.`);
    toast({title: "Connection Created"});
    setConnectingState(null);
  };

  const handleOpenTemplateSelector = () => setIsTemplateSelectorOpen(true);
  const handleCloseTemplateSelector = () => setIsTemplateSelectorOpen(false);

  const handleLoadTemplate = useCallback((template: WorkflowTemplate) => {
    addConsoleMessage('info', `Loading template: "${template.name}"`);
    clearWorkflow();
    const idMap: Record<string, string> = {};
    const newNodes: WorkflowNodeData[] = template.nodes.map((nodeDef, index) => {
      const newNodeId = generateNodeId('template', nodeDef.title, `${Date.now()}-${index}`);
      idMap[nodeDef.localId] = newNodeId;
      return { ...nodeDef, id: newNodeId, status: 'queued', position: nodeDef.position };
    });
    const newConnections: Connection[] = template.connections.map((connDef, index) => ({
      id: `conn-template-${Date.now()}-${index}`,
      from: idMap[connDef.fromLocalId],
      to: idMap[connDef.toLocalId],
    }));

    setWorkflow({ nodes: newNodes, connections: newConnections });
    setWorkflowName(template.name);
    
    toast({ title: "Template Loaded", description: `Workflow "${template.name}" is ready.` });
    addTimelineEvent({ type: 'info', message: `Workflow template "${template.name}" loaded.` });
    visualizeWorkflowExecution({
        workflowName: template.name,
        nodes: newNodes,
        connections: template.connections.map(c => ({ fromLocalId: c.fromLocalId, toLocalId: c.toLocalId})),
        message: 'Template loaded',
        error: false,
    });
    setIsTemplateSelectorOpen(false);
  }, [addConsoleMessage, addTimelineEvent, toast, visualizeWorkflowExecution, setWorkflow, clearWorkflow]);

  const anyMobilePanelOpen = isMobile && Object.values(panelVisibility).some(v => v);

  if (isMobile) {
    return (
      <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
        <TopBar
          onFlowGenerated={handleFlowGenerated}
          addConsoleMessage={addConsoleMessage}
          panelVisibility={panelVisibility}
          togglePanel={togglePanel}
          isMobile={isMobile}
          anyMobilePanelOpen={anyMobilePanelOpen}
          onOpenTemplateSelector={handleOpenTemplateSelector}
        />
        <main className={`flex-1 relative flex overflow-hidden p-0 pb-16`}>
           <div className={`flex-1 h-full transition-opacity duration-300 ${anyMobilePanelOpen ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
              <CanvasZone
                workflowName={workflowName}
                nodes={nodes}
                connections={connections}
                onNodeDropped={handleNodeDropped}
                selectedNode={selectedNode}
                onNodeSelected={handleNodeSelected}
                nodeExecutionStatus={nodeExecutionStatus}
                onInputPortClick={handleInputPortClick}
                onOutputPortClick={handleOutputPortClick}
                connectingState={connectingState}
              />
            </div>

            {/* Mobile Panels */}
            <div className={`fixed inset-y-0 left-0 z-40 w-4/5 max-w-sm bg-card/90 backdrop-blur-lg shadow-2xl transform transition-transform duration-300 ease-in-out ${panelVisibility.palette ? 'translate-x-0' : '-translate-x-full'}`}>
              {panelVisibility.palette && <PalettePanel className="h-full" onClose={() => togglePanel('palette')} isMobile={isMobile} />}
            </div>
            <div className={`fixed inset-y-0 right-0 z-40 w-4/5 max-w-sm bg-card/90 backdrop-blur-lg shadow-2xl transform transition-transform duration-300 ease-in-out ${panelVisibility.inspector ? 'translate-x-0' : 'translate-x-full'}`}>
              {panelVisibility.inspector &&
                <TooltipProvider delayDuration={300}>
                  <InspectorPanel
                    key={selectedNode?.id || 'inspector-mobile-empty'}
                    className="h-full overflow-y-auto"
                    onClose={() => togglePanel('inspector')}
                    selectedNode={selectedNode}
                    onNodeUpdate={handleNodeUpdate}
                    onNodeDelete={handleDeleteNode}
                    isMobile={isMobile}
                    onRunNode={handleRunNode}
                    isNodeRunning={isNodeRunning}
                  />
                </TooltipProvider>
              }
            </div>
            <div className={`fixed inset-y-0 right-0 z-40 w-4/5 max-w-sm bg-card/90 backdrop-blur-lg shadow-2xl transform transition-transform duration-300 ease-in-out ${panelVisibility.agentHub ? 'translate-x-0' : 'translate-x-full'}`}>
              {panelVisibility.agentHub && <AgentHubPanel className="h-full" onClose={() => togglePanel('agentHub')} isMobile={isMobile} addConsoleMessage={addConsoleMessage} addTimelineEvent={addTimelineEvent} />}
            </div>
            <div className={`fixed inset-y-0 right-0 z-40 w-4/5 max-w-sm bg-card/90 backdrop-blur-lg shadow-2xl transform transition-transform duration-300 ease-in-out ${panelVisibility.actionConsole ? 'translate-x-0' : 'translate-x-full'}`}>
              {panelVisibility.actionConsole && <ActionConsolePanel className="h-full" requests={actionRequests} onRespond={handleAgentActionResponse} onClose={() => togglePanel('actionConsole')} isMobile={isMobile} addConsoleMessage={addConsoleMessage} addTimelineEvent={addTimelineEvent} />}
            </div>
            <div className={`fixed inset-x-0 bottom-0 z-40 h-3/5 bg-card/90 backdrop-blur-lg shadow-2xl transform transition-transform duration-300 ease-in-out ${panelVisibility.timeline ? 'translate-y-0' : 'translate-y-full'} mb-14`}>
              {panelVisibility.timeline && <TimelinePanel className="h-full" onClose={() => togglePanel('timeline')} events={timelineEvents} isMobile={isMobile} />}
            </div>
            <div className={`fixed inset-x-0 bottom-0 z-40 h-3/5 bg-card/90 backdrop-blur-lg shadow-2xl transform transition-transform duration-300 ease-in-out ${panelVisibility.console ? 'translate-y-0' : 'translate-y-full'} mb-14`}>
              {panelVisibility.console && <ConsolePanel className="h-full" onClose={() => togglePanel('console')} messages={consoleMessages.filter(msg => consoleFilters[msg.type])} filters={consoleFilters} onToggleFilter={toggleConsoleFilter} onClearConsole={handleClearConsole} isMobile={isMobile} />}
            </div>
            {anyMobilePanelOpen && (
              <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm" onClick={closeAllMobilePanels} aria-label="Close panel" role="button" />
            )}
        </main>
        <BottomBar panelVisibility={panelVisibility} togglePanel={togglePanel} />
        <TemplateSelectorDialog
          isOpen={isTemplateSelectorOpen}
          onClose={handleCloseTemplateSelector}
          templates={exampleTemplates}
          onLoadTemplate={handleLoadTemplate}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      <TopBar
        onFlowGenerated={handleFlowGenerated}
        addConsoleMessage={addConsoleMessage}
        panelVisibility={panelVisibility}
        togglePanel={togglePanel}
        isMobile={isMobile}
        anyMobilePanelOpen={anyMobilePanelOpen}
        onOpenTemplateSelector={handleOpenTemplateSelector}
      />
      <main className="flex-1 p-2 flex gap-2 overflow-hidden">
        <TooltipProvider delayDuration={300}>
          <ResizableHorizontalPanes storageKey="loom-main-h-split" initialDividerPosition={20}>

            {/* Left Column */}
            <ResizableVerticalPanes storageKey="loom-left-v-split" initialDividerPosition={50} minPaneHeight={150}>
              <PalettePanel className={cn(!panelVisibility.palette && "hidden")} onClose={() => togglePanel('palette')} />
              <AgentHubPanel className={cn(!panelVisibility.agentHub && "hidden")} onClose={() => togglePanel('agentHub')} addConsoleMessage={addConsoleMessage} addTimelineEvent={addTimelineEvent} />
            </ResizableVerticalPanes>
            
            {/* Center & Right Column */}
            <ResizableHorizontalPanes storageKey="loom-center-right-h-split" initialDividerPosition={75}>

              {/* Center Column */}
              <ResizableVerticalPanes storageKey="loom-center-v-split" initialDividerPosition={70} minPaneHeight={100}>
                <CanvasZone
                  workflowName={workflowName}
                  nodes={nodes}
                  connections={connections}
                  onNodeDropped={handleNodeDropped}
                  selectedNode={selectedNode}
                  onNodeSelected={handleNodeSelected}
                  nodeExecutionStatus={nodeExecutionStatus}
                  onInputPortClick={handleInputPortClick}
                  onOutputPortClick={handleOutputPortClick}
                  connectingState={connectingState}
                />
                
                <ResizableHorizontalPanes storageKey="loom-bottom-h-split" minPaneWidth={200}>
                    <TimelinePanel className={cn(!panelVisibility.timeline && "hidden")} onClose={() => togglePanel('timeline')} events={timelineEvents} />
                    <ConsolePanel className={cn(!panelVisibility.console && "hidden")}
                        onClose={() => togglePanel('console')}
                        messages={consoleMessages.filter(msg => consoleFilters[msg.type])}
                        filters={consoleFilters}
                        onToggleFilter={toggleConsoleFilter}
                        onClearConsole={handleClearConsole}
                    />
                </ResizableHorizontalPanes>

              </ResizableVerticalPanes>
              
              {/* Right Column */}
              <ResizableVerticalPanes storageKey="loom-right-v-split" initialDividerPosition={65} minPaneHeight={150}>
                 <InspectorPanel
                    key={selectedNode?.id || 'inspector-empty'}
                    className={cn(!panelVisibility.inspector && "hidden")}
                    onClose={() => togglePanel('inspector')}
                    selectedNode={selectedNode}
                    onNodeUpdate={handleNodeUpdate}
                    onNodeDelete={handleDeleteNode}
                    onRunNode={handleRunNode}
                    isNodeRunning={isNodeRunning}
                  />
                  <ActionConsolePanel className={cn(!panelVisibility.actionConsole && "hidden")}
                    onClose={() => togglePanel('actionConsole')}
                    requests={actionRequests}
                    onRespond={handleAgentActionResponse}
                    addConsoleMessage={addConsoleMessage}
                    addTimelineEvent={addTimelineEvent}
                  />
              </ResizableVerticalPanes>

            </ResizableHorizontalPanes>

          </ResizableHorizontalPanes>
        </TooltipProvider>

        <TemplateSelectorDialog
          isOpen={isTemplateSelectorOpen}
          onClose={handleCloseTemplateSelector}
          templates={exampleTemplates}
          onLoadTemplate={handleLoadTemplate}
        />
      </main>
    </div>
  );
}
