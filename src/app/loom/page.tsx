
// src/app/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { TopBar } from '@/components/dashboard/loom/layout/top-bar';
import { BottomBar } from '@/components/dashboard/loom/layout/bottom-bar';
import { CanvasZone } from '@/components/dashboard/loom/canvas/canvas-zone';
import { PalettePanel } from '@/components/dashboard/loom/panels/palette-panel';
import { InspectorPanel } from '@/components/dashboard/loom/panels/inspector-panel';
import { TimelinePanel } from '@/components/dashboard/loom/panels/timeline-panel';
import { ConsolePanel } from '@/components/dashboard/loom/panels/console-panel';
import { AgentHubPanel } from '@/components/dashboard/loom/panels/agent-hub-panel';
import { ActionConsolePanel } from '@/components/dashboard/loom/panels/action-console-panel';
import { TemplateSelectorDialog } from '@/components/dashboard/loom/panels/template-selector-dialog';
import type { WorkflowNodeData, NodeStatus, NodeType } from '@/components/dashboard/loom/workflow/workflow-node';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { generateNodeId } from '@/lib/utils';
import { ResizableHorizontalPanes } from '@/components/dashboard/loom/layout/resizable-horizontal-panes';
import { ResizableVerticalPanes } from '@/components/dashboard/loom/layout/resizable-vertical-panes';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useBeepChat } from '@/hooks/use-beep-chat';
import eventBus from '@/lib/event-bus';
import type { WebSummarizerResult } from '@/lib/ai-schemas';

import type {
  PanelVisibility,
  ConnectingState,
  AiGeneratedFlowData,
  BackendSummarizeOutput,
  BackendExecutePromptOutput,
  ActionRequest,
  ConsoleMessage,
  TimelineEvent,
  WorkflowTemplate,
  Connection,
} from '@/types/loom';


const exampleTemplates: WorkflowTemplate[] = [];
const initialActionRequests: ActionRequest[] = [];


export default function LoomStudioPage() {
  const [generatedFlow, setGeneratedFlow] = useState<AiGeneratedFlowData | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [connectingState, setConnectingState] = useState<ConnectingState | null>(null);
  const [selectedNode, setSelectedNode] = useState<WorkflowNodeData | null>(null);
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

  const { append: beepAppend } = useBeepChat();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  useEffect(() => {
    // This useEffect is a placeholder for where you might fetch initial console data.
    // The previous Firebase logic has been removed as it's not configured in this project.
    const welcomeMessage: ConsoleMessage = {
        type: 'info',
        text: 'Loom Studio Initialized. No persistent storage connected.',
        timestamp: new Date()
    };
    setConsoleMessages([welcomeMessage]);
  }, []);
  
  useEffect(() => {
    const handleSummarizerResult = (result: WebSummarizerResult) => {
        addConsoleMessage('info', `Web summarizer finished for URL: ${result.originalUrl}`);
        setGeneratedFlow(prevFlow => {
            if (!prevFlow) return null;
            const runningNode = prevFlow.nodes.find(n => n.status === 'running' && n.type === 'web-summarizer');
            if (!runningNode) return prevFlow;

            const newNodes = prevFlow.nodes.map(n => 
                n.id === runningNode.id 
                ? { ...n, status: 'completed' as NodeStatus, config: { ...n.config, output: result } }
                : n
            );
            return { ...prevFlow, nodes: newNodes };
        });
        setNodeExecutionStatus(prev => {
            const runningNode = generatedFlow?.nodes.find(n => n.status === 'running' && n.type === 'web-summarizer');
            if (!runningNode) return prev;
            return { ...prev, [runningNode.id]: 'completed' };
        });
    };

    const handleSummarizerError = (error: string) => {
        addConsoleMessage('error', `Web summarizer failed: ${error}`);
        setGeneratedFlow(prevFlow => {
             if (!prevFlow) return null;
            const runningNode = prevFlow.nodes.find(n => n.status === 'running' && n.type === 'web-summarizer');
            if (!runningNode) return prevFlow;

            const newNodes = prevFlow.nodes.map(n => 
                n.id === runningNode.id 
                ? { ...n, status: 'failed' as NodeStatus, config: { ...n.config, output: { error } } }
                : n
            );
            return { ...prevFlow, nodes: newNodes };
        });
        setNodeExecutionStatus(prev => {
            const runningNode = generatedFlow?.nodes.find(n => n.status === 'running' && n.type === 'web-summarizer');
            if (!runningNode) return prev;
            return { ...prev, [runningNode.id]: 'failed' };
        });
    }

    eventBus.on('websummarizer:result', handleSummarizerResult);
    eventBus.on('websummarizer:error', handleSummarizerError);

    return () => {
        eventBus.off('websummarizer:result', handleSummarizerResult);
        eventBus.off('websummarizer:error', handleSummarizerError);
    }
  }, [addConsoleMessage, generatedFlow]);

  const addConsoleMessage = useCallback((type: ConsoleMessage['type'], text: string) => {
    const newMessage: ConsoleMessage = { type, text, timestamp: new Date() };
    setConsoleMessages(prev => [newMessage, ...prev.slice(0, 199)]);
    // Removed firestore logging
  }, []);


  const addTimelineEvent = useCallback((event: Omit<TimelineEvent, 'id' | 'timestamp'>) => {
    setTimelineEvents(prev => [{ ...event, id: crypto.randomUUID(), timestamp: new Date() }, ...prev.slice(0, 49)]);
  }, []);

  const handleAgentActionResponse = useCallback((requestId: string, responseStatus: 'approved' | 'denied' | 'responded', details?: string) => {
    const request = actionRequests.find(r => r.id === requestId);
    if (!request) return;

    const logMessage = `Agent Action: Request ID ${requestId} (${request.requestType} from ${request.agentName}) was ${responseStatus}. ${details ? `Details: "${details}"` : ''}. (Local UI - backend interaction pending)`;
    addConsoleMessage('info', logMessage);
    addTimelineEvent({ type: 'info', message: `User ${responseStatus} agent action: ${request.agentName}. (Local UI)` });

    toast({
      title: `Agent Action ${responseStatus.charAt(0).toUpperCase() + responseStatus.slice(1)} (Local UI)`,
      description: `Request from ${request.agentName} (ID: ${requestId.substring(0,8)}) has been marked ${responseStatus}. ${details ? `Input: "${details.substring(0, 50)}${details.length > 50 ? "..." : ""}"` : ""} Backend processing pending.`,
    });
  }, [actionRequests, addConsoleMessage, addTimelineEvent, toast]);


 useEffect(() => {
    // No automatic panel visibility changes based on isMobile anymore
  }, [isMobile]);


  const visualizeWorkflowExecution = useCallback(async () => {
    if (!generatedFlow || generatedFlow.nodes.length === 0 || !generatedFlow.workflowName) {
        addConsoleMessage('warn', 'No workflow or nodes available to visualize.');
        return;
    }

    const currentNodes = generatedFlow.nodes;
    const workflowName = generatedFlow.workflowName;

    addConsoleMessage('info', `Workflow "${workflowName}" initialized for display on canvas.`);
    addTimelineEvent({ type: 'workflow_start', message: `Workflow "${workflowName}" displayed.` });

    const initialStatuses: Record<string, NodeStatus> = {};
    currentNodes.forEach(node => {
      initialStatuses[node.id] = 'queued'; // All nodes start as queued
      addTimelineEvent({ nodeId: node.id, nodeTitle: node.title, type: 'node_queued', message: `Node "${node.title}" set to 'queued'.` });
    });
    setNodeExecutionStatus(initialStatuses);

    addConsoleMessage('info', `Workflow "${workflowName}" node statuses initialized to 'queued'. Awaiting user action or further backend execution signals.`);

  }, [generatedFlow, addConsoleMessage, addTimelineEvent, setNodeExecutionStatus]);


  const handleFlowGenerated = useCallback((data: AiGeneratedFlowData) => {
    setGeneratedFlow(data);
    setSelectedNode(null);

    if (data.swarmId) {
      addConsoleMessage('info', `Backend Swarm ID for this flow: ${data.swarmId}`);
    }

    if (data.error) {
      addConsoleMessage('error', `Failed to generate flow: ${data.message || 'Unknown error'}`);
      setTimelineEvents([]); // Clear timeline for error state
      setNodeExecutionStatus({}); // Clear statuses
      setConnections([]); // Clear connections
    } else {
      if (data.nodes.length > 0 && data.workflowName) {
        addConsoleMessage('info', `Flow "${data.workflowName}" generated with ${data.nodes.length} steps. Preparing for display...`);

        const newConnections: Connection[] = [];
        for (let i = 0; i < data.nodes.length - 1; i++) {
          newConnections.push({
            id: `conn-${data.nodes[i].id}-to-${data.nodes[i+1].id}-${Date.now()}`,
            from: data.nodes[i].id,
            to: data.nodes[i+1].id,
          });
        }
        setConnections(newConnections);
        addConsoleMessage('info', `Auto-created ${newConnections.length} connections for the generated flow.`);

        // Call visualizeWorkflowExecution without artificial delays
        Promise.resolve().then(() => visualizeWorkflowExecution());

      } else {
         addConsoleMessage('info', `Flow "${data.workflowName || 'Untitled Flow'}" generated but contained no actionable steps.`);
         setTimelineEvents([]);
         setNodeExecutionStatus({});
         setConnections([]);
      }
    }
  }, [addConsoleMessage, visualizeWorkflowExecution]);

  const handleNodeDropped = (newNodeData: Omit<WorkflowNodeData, 'id' | 'status'> & { status?: NodeStatus }) => {
    const uniqueIndex = Date.now();
    const nodeTitleBase = newNodeData.title || 'Manual Node';
    const nodeId = generateNodeId('manual', nodeTitleBase, uniqueIndex);

    const nodeWithIdAndStatus: WorkflowNodeData = {
      ...newNodeData,
      id: nodeId,
      title: nodeTitleBase,
      description: newNodeData.description || `Manually added ${nodeTitleBase} node. Configure in Inspector.`,
      status: 'queued',
      config: newNodeData.config || {},
    };

    setGeneratedFlow(prevFlow => {
      const currentNodes = prevFlow?.nodes || [];
      const isFirstNodeForNewWorkflow = !prevFlow || currentNodes.length === 0;
      const newWorkflowName = prevFlow?.workflowName || "My Custom Flow";

      if (isFirstNodeForNewWorkflow && !prevFlow?.workflowName) {
        addConsoleMessage('info', `New custom workflow "${newWorkflowName}" started by user adding node: "${nodeWithIdAndStatus.title}".`);
        addTimelineEvent({ type: 'workflow_start', message: `Custom workflow "${newWorkflowName}" started.`});
      }

      const updatedNodes = [...currentNodes, nodeWithIdAndStatus];
      return {
        message: prevFlow?.message || "Node added to canvas.",
        userInput: prevFlow?.userInput || "Custom flow",
        error: prevFlow?.error || false,
        nodes: updatedNodes,
        workflowName: newWorkflowName,
      };
    });

    setSelectedNode(nodeWithIdAndStatus);
    addConsoleMessage('log', `Node "${nodeWithIdAndStatus.title}" (ID: ${nodeWithIdAndStatus.id}) added to canvas.`);
    setNodeExecutionStatus(prev => ({...prev, [nodeWithIdAndStatus.id]: nodeWithIdAndStatus.status! }));
    addTimelineEvent({
      nodeId: nodeWithIdAndStatus.id,
      nodeTitle: nodeWithIdAndStatus.title,
      type: 'node_queued',
      message: `Manual Node "${nodeWithIdAndStatus.title}" added and queued.`
    });
  };

  const handleNodeSelected = (node: WorkflowNodeData | null) => {
    if (node) {
      setSelectedNode(node);
      setConnectingState(null);
      addConsoleMessage('log', `Node "${node.title}" (ID: ${node.id}) selected.`);
    } else {
      if (connectingState) {
        addConsoleMessage('info', `Connection attempt cancelled by clicking canvas background.`);
      }
      setSelectedNode(null);
      setConnectingState(null);
      addConsoleMessage('log', `Canvas selected (no node).`);
    }
  };

  const handleNodeUpdate = (updatedNode: WorkflowNodeData) => {
     setGeneratedFlow(prevFlow => {
      if (!prevFlow) return prevFlow;
      const newNodes = prevFlow.nodes.map(n => (n.id === updatedNode.id ? updatedNode : n));
      return { ...prevFlow, nodes: newNodes };
    });
    setSelectedNode(updatedNode);
    toast({ title: "Node Updated", description: `Node "${updatedNode.title}" has been saved.` });
    addConsoleMessage('info', `Node "${updatedNode.title}" (ID: ${updatedNode.id}) updated.`);

    const oldStatus = nodeExecutionStatus[updatedNode.id];
    if (updatedNode.status && oldStatus !== updatedNode.status) {
      setNodeExecutionStatus(prev => ({...prev, [updatedNode.id]: updatedNode.status! }));

      const statusToEventTypeMap: Partial<Record<NodeStatus, TimelineEvent['type']>> = {
        completed: 'node_completed',
        running: 'node_running',
        failed: 'node_failed',
        queued: 'node_queued',
      };
      const eventType: TimelineEvent['type'] = statusToEventTypeMap[updatedNode.status!] || 'info';

      addTimelineEvent({
        nodeId: updatedNode.id,
        nodeTitle: updatedNode.title,
        type: eventType,
        message: `Node "${updatedNode.title}" status manually updated to ${updatedNode.status}.`
      });
    }
  };

  const handleDeleteNode = (nodeId: string) => {
    const nodeToDelete = generatedFlow?.nodes?.find(n => n.id === nodeId);
    if (!nodeToDelete) {
        addConsoleMessage('warn', `Attempted to delete non-existent node ID: ${nodeId}`);
        return;
    }

    setGeneratedFlow(prevFlow => {
      if (!prevFlow) return prevFlow;
      const newNodes = prevFlow.nodes.filter(n => n.id !== nodeId);
      return { ...prevFlow, nodes: newNodes };
    });

    setConnections(prevConns => prevConns.filter(c => c.from !== nodeId && c.to !== nodeId));

    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
    setNodeExecutionStatus(prevStatus => {
      const newStatus = { ...prevStatus };
      delete newStatus[nodeId];
      return newStatus;
    });
    addConsoleMessage('info', `Node "${nodeToDelete.title}" (ID: ${nodeId}) and its connections deleted.`);
    addTimelineEvent({ type: 'info', message: `Node "${nodeToDelete.title}" deleted.`});
    toast({ title: "Node Deleted", description: `Node "${nodeToDelete.title}" has been removed.`});
  };


  const handleRunNode = async (nodeId: string) => {
    const nodeToRun = generatedFlow?.nodes?.find(n => n.id === nodeId);
    if (!nodeToRun) {
      addConsoleMessage('error', `Attempted to run non-existent node ID: ${nodeId}`);
      return;
    }

    setNodeExecutionStatus(prev => ({ ...prev, [nodeId]: 'running' }));
    addTimelineEvent({ type: 'node_running', message: `Executing node: ${nodeToRun.title}`, nodeId: nodeToRun.id, nodeTitle: nodeToRun.title });
    
    let prompt = '';
    switch (nodeToRun.type) {
        case 'web-summarizer':
            if (!nodeToRun.config?.url) {
                addConsoleMessage('error', `Node "${nodeToRun.title}" is missing a URL in its configuration.`);
                setNodeExecutionStatus(prev => ({...prev, [nodeId]: 'failed'}));
                return;
            }
            prompt = `Please summarize the content from the webpage at this URL: ${nodeToRun.config.url}`;
            break;
        case 'prompt':
             if (!nodeToRun.config?.promptText) {
                addConsoleMessage('error', `Node "${nodeToRun.title}" is missing prompt text in its configuration.`);
                setNodeExecutionStatus(prev => ({...prev, [nodeId]: 'failed'}));
                return;
            }
            prompt = nodeToRun.config.promptText;
            break;
        // Add other cases here as more node types become executable
        default:
            toast({ title: "Execution Not Implemented", description: `Backend for node type '${nodeToRun.type}' is not yet implemented.`});
            addConsoleMessage('warn', `Execution for node type '${nodeToRun.type}' is not implemented. Faking failure.`);
            setTimeout(() => {
                setNodeExecutionStatus(prev => ({ ...prev, [nodeId]: 'failed' }));
            }, 1500);
            return;
    }

    if (prompt) {
        addConsoleMessage('info', `Dispatching task to BEEP for node "${nodeToRun.title}": ${prompt}`);
        beepAppend({ role: 'user', content: prompt });
    }
  };

  const isNodeRunning = (nodeId: string): boolean => nodeExecutionStatus[nodeId] === 'running';

  const togglePanel = (panel: keyof PanelVisibility) => {
    setPanelVisibility(prev => {
      const newState = { ...prev };
      const currentlyOpening = !prev[panel];
      if (isMobile) {
        if (currentlyOpening) {
          (Object.keys(newState) as Array<keyof PanelVisibility>).forEach(key => {
            if (key !== panel) newState[key] = false;
          });
          newState[panel] = true;
        } else {
          newState[panel] = false;
        }
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
    const newFilterState = !consoleFilters[type];
    setConsoleFilters(prev => ({ ...prev, [type]: newFilterState }));
    addConsoleMessage('log', `Console filter for "${type.toUpperCase()}" messages ${newFilterState ? 'enabled' : 'disabled'}.`);
  };

  const handleClearConsole = () => {
    const clearMessageText = 'Local console view cleared. Firestore logs are not affected by this action.';
    const clearMessageEntry: ConsoleMessage = { type: 'info', text: clearMessageText, timestamp: new Date() };
    setConsoleMessages([clearMessageEntry]);
    toast({ title: "Console Cleared", description: "Local console messages have been cleared." });
  };


  const handleOutputPortClick = (nodeId: string, portElement: HTMLDivElement) => {
    addConsoleMessage('log', `Output port clicked on node ${nodeId}. Waiting for input port selection.`);
    setConnectingState({ fromNodeId: nodeId, fromPortElement: portElement });
    setSelectedNode(generatedFlow?.nodes.find(n => n.id === nodeId) || null);
  };

  const handleInputPortClick = (nodeId: string) => {
    if (connectingState) {
      if (connectingState.fromNodeId === nodeId) {
        addConsoleMessage('warn', "Cannot connect a node to itself.");
        toast({title: "Connection Error", description: "Cannot connect a node to itself.", variant: "destructive"});
        setConnectingState(null);
        return;
      }
      if (connections.some(c => c.from === connectingState.fromNodeId && c.to === nodeId)) {
        addConsoleMessage('warn', `Connection from ${connectingState.fromNodeId} to ${nodeId} already exists.`);
        toast({title: "Connection Error", description: "This connection already exists.", variant: "secondary"});
        setConnectingState(null);
        return;
      }

      const newConnection: Connection = {
        id: `conn-${connectingState.fromNodeId}-to-${nodeId}-${Date.now()}`,
        from: connectingState.fromNodeId,
        to: nodeId,
      };
      setConnections(prev => [...prev, newConnection]);
      const fromNode = generatedFlow?.nodes.find(n=>n.id===connectingState.fromNodeId)?.title || 'source node';
      const toNode = generatedFlow?.nodes.find(n=>n.id===nodeId)?.title || 'target node';
      addConsoleMessage('info', `Connected node ${fromNode} to ${toNode}.`);
      toast({title: "Connection Created", description: `Connected ${fromNode} to ${toNode}.`});
      setConnectingState(null);
    }
  };

  const handleOpenTemplateSelector = () => {
    setIsTemplateSelectorOpen(true);
    addConsoleMessage('log', 'Template selector opened.');
  };

  const handleCloseTemplateSelector = () => {
    setIsTemplateSelectorOpen(false);
  };

  const handleLoadTemplate = useCallback((template: WorkflowTemplate) => {
    addConsoleMessage('info', `Loading template: "${template.name}"`);
    const idMap: Record<string, string> = {};
    const newNodes: WorkflowNodeData[] = template.nodes.map((nodeDef, index) => {
      const newNodeId = generateNodeId('template', nodeDef.title.replace(/\s+/g, '-'), `${Date.now()}-${index}`);
      idMap[nodeDef.localId] = newNodeId;
      return {
        ...nodeDef,
        id: newNodeId,
        status: 'queued' as NodeStatus,
        position: nodeDef.position || { x: 50 + index * 50, y: 100 + index * 50 },
      };
    });

    const newConnections: Connection[] = template.connections.map((connDef, index) => ({
      id: `conn-template-${Date.now()}-${index}`,
      from: idMap[connDef.fromLocalId],
      to: idMap[connDef.toLocalId],
    }));

    setGeneratedFlow({
      workflowName: template.name,
      nodes: newNodes,
      message: `Template "${template.name}" loaded.`,
      error: false,
    });
    setConnections(newConnections);
    setSelectedNode(null);
    setConnectingState(null);

    toast({ title: "Template Loaded", description: `Workflow "${template.name}" is ready.` });
    addTimelineEvent({ type: 'info', message: `Workflow template "${template.name}" loaded onto canvas.` });

    Promise.resolve().then(() => visualizeWorkflowExecution());
    setIsTemplateSelectorOpen(false);
  }, [addConsoleMessage, addTimelineEvent, toast, visualizeWorkflowExecution]);


  const anyMobilePanelOpen = isMobile && Object.values(panelVisibility).some(v => v);

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
        swarmId={generatedFlow?.swarmId}
      />
      <main className={`flex-1 relative flex overflow-hidden ${isMobile ? 'p-0' : 'p-4 gap-4'} ${isMobile ? 'pb-16' : ''}`}>
        <div className={`flex-1 h-full transition-opacity duration-300 ${anyMobilePanelOpen ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
          <CanvasZone
            workflowName={generatedFlow?.workflowName}
            nodes={generatedFlow?.nodes || []}
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

        {!isMobile ? (
          <>
            {panelVisibility.palette && (
              <PalettePanel className="absolute top-4 left-4 z-10" onClose={() => togglePanel('palette')} isMobile={isMobile} />
            )}
            <div className="absolute top-4 right-4 bottom-4 w-[360px] z-10 flex flex-col gap-4">
               <ResizableVerticalPanes
                  storageKey="right-panels-split-v1"
                  initialDividerPosition={60}
                  minPaneHeight={150}
                >
                  {panelVisibility.inspector && (
                    <TooltipProvider delayDuration={300}>
                      <InspectorPanel
                        key={selectedNode ? `inspector-desktop-${selectedNode.id}` : 'inspector-desktop-no-node'}
                        className="h-full"
                        onClose={() => togglePanel('inspector')}
                        selectedNode={selectedNode}
                        onNodeUpdate={handleNodeUpdate}
                        onNodeDelete={handleDeleteNode}
                        isMobile={isMobile}
                        onRunNode={handleRunNode}
                        isNodeRunning={isNodeRunning}
                        isResizable={true}
                        initialSize={{ width: '100%', height: '100%' }}
                      />
                    </TooltipProvider>
                  )}
                  <div className="flex flex-col gap-4 h-full overflow-hidden">
                    {panelVisibility.agentHub && (
                       <AgentHubPanel
                        className="flex-1 min-h-0"
                        onClose={() => togglePanel('agentHub')}
                        isMobile={isMobile}
                        addConsoleMessage={addConsoleMessage}
                        addTimelineEvent={addTimelineEvent}
                        isResizable={true}
                        initialSize={{ width: '100%', height: 'auto' }}
                      />
                    )}
                    {panelVisibility.actionConsole && (
                       <ActionConsolePanel
                        className="flex-1 min-h-0"
                        onClose={() => togglePanel('actionConsole')}
                        requests={actionRequests}
                        onRespond={handleAgentActionResponse}
                        isMobile={isMobile}
                        addConsoleMessage={addConsoleMessage}
                        addTimelineEvent={addTimelineEvent}
                        isResizable={true}
                        initialSize={{ width: '100%', height: 'auto' }}
                      />
                    )}
                  </div>
              </ResizableVerticalPanes>
            </div>

            <div className="absolute bottom-4 left-4 right-[calc(360px+2rem)] h-[240px] z-10">
              <ResizableHorizontalPanes storageKey="bottom-panels-split-v1" minPaneWidth={200}>
                {panelVisibility.timeline && (
                  <TimelinePanel
                    onClose={() => togglePanel('timeline')}
                    events={timelineEvents}
                    isMobile={isMobile}
                    isResizable={true}
                    initialSize={{ width: 'auto', height: 'auto' }}
                    className="h-full w-full"
                  />
                )}
                {panelVisibility.console && (
                  <ConsolePanel
                    onClose={() => togglePanel('console')}
                    messages={consoleMessages.filter(msg => consoleFilters[msg.type])}
                    filters={consoleFilters}
                    onToggleFilter={toggleConsoleFilter}
                    onClearConsole={handleClearConsole}
                    isMobile={isMobile}
                    isResizable={true}
                    initialSize={{ width: 'auto', height: 'auto' }}
                    className="h-full w-full"
                  />
                )}
              </ResizableHorizontalPanes>
            </div>
          </>
        ) : (
          <>
            <div className={`fixed inset-y-0 left-0 z-40 w-4/5 max-w-sm bg-card/90 backdrop-blur-lg shadow-2xl transform transition-transform duration-300 ease-in-out ${panelVisibility.palette ? 'translate-x-0' : '-translate-x-full'}`}>
              {panelVisibility.palette && <PalettePanel className="h-full" onClose={() => togglePanel('palette')} isMobile={isMobile} />}
            </div>
            <div className={`fixed inset-y-0 right-0 z-40 w-4/5 max-w-sm bg-card/90 backdrop-blur-lg shadow-2xl transform transition-transform duration-300 ease-in-out ${panelVisibility.inspector ? 'translate-x-0' : 'translate-x-full'}`}>
              {panelVisibility.inspector &&
                <TooltipProvider delayDuration={300}>
                  <InspectorPanel
                    key={selectedNode ? `inspector-mobile-${selectedNode.id}` : 'inspector-mobile-no-node'}
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
          </>
        )}
        <TemplateSelectorDialog
          isOpen={isTemplateSelectorOpen}
          onClose={handleCloseTemplateSelector}
          templates={exampleTemplates}
          onLoadTemplate={handleLoadTemplate}
        />
      </main>
      {isMobile && <BottomBar panelVisibility={panelVisibility} togglePanel={togglePanel} />}
    </div>
  );
}
