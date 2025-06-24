
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
} from '@/types/loom';


export default function LoomStudioPage() {
  const {
    nodes, connections, selectedNodeId, consoleMessages, timelineEvents, actionRequests,
    workflowName, nodeExecutionStatus,
    setWorkflow, setSelectedNodeId, updateNode, deleteNode, addNode, addConnection,
    clearWorkflow, addConsoleMessage, addTimelineEvent, updateActionRequestStatus, clearConsole,
    setNodeExecutionStatus, updateNodeStatus,
  } = useLoomStore(state => ({...state}), shallow);

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
  const [isWorkflowRunning, setIsWorkflowRunning] = useState(false);

  const { append: beepAppend, messages: beepMessages, isLoading: isBeepLoading, error: beepError } = useBeepChat();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const selectedNode = nodes.find(n => n.id === selectedNodeId) || null;
  const prevNodeStatusRef = useRef<Record<string, NodeStatus>>({});

  useEffect(() => {
    addConsoleMessage('info', 'Loom Studio Initialized. AI is standing by to generate workflows.');
    
    const openTemplateHandler = () => setIsTemplateSelectorOpen(true);
    eventBus.on('loom:open-templates', openTemplateHandler);
    
    return () => {
      eventBus.off('loom:open-templates', openTemplateHandler);
    };
  }, [addConsoleMessage]);

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
          return { ...node, id: newNodeId, status: 'pending' };
      });
      const newConnections: Connection[] = (data.connections || []).map((conn, index) => ({
          id: `conn-ai-${Date.now()}-${index}`,
          from: idMap[conn.fromLocalId],
          to: idMap[conn.toLocalId],
      })).filter(c => c.from && c.to);
      
      setWorkflow({ nodes: newNodes, connections: newConnections, workflowName: data.workflowName });
      addTimelineEvent({ type: 'info', message: `Workflow "${data.workflowName}" loaded and ready to run.`});
    }
  }, [addConsoleMessage, setWorkflow, clearWorkflow, setSelectedNodeId, addTimelineEvent]);

  useEffect(() => {
    eventBus.on('loom:flow-generated', handleFlowGenerated);
    return () => {
      eventBus.off('loom:flow-generated', handleFlowGenerated);
    };
  }, [handleFlowGenerated]);
  
  const runningNodeId = Object.keys(nodeExecutionStatus).find(
    (id) => nodeExecutionStatus[id] === 'running'
  );

  useEffect(() => {
    if (beepError && runningNodeId) {
      const runningNode = nodes.find(n => n.id === runningNodeId);
      if (runningNode) {
        const errorMessage = beepError.message || 'An unknown API error occurred.';
        updateNode(runningNode.id, {
          status: 'failed',
          config: { ...runningNode.config, output: { error: errorMessage } }
        });
        updateNodeStatus(runningNode.id, 'failed');
        addTimelineEvent({
          type: 'node_failed',
          message: `Node failed due to API error: ${errorMessage}`,
          nodeId: runningNode.id,
          nodeTitle: runningNode.title,
        });
        addConsoleMessage('error', `Node ${runningNode.title} failed: ${errorMessage}`);
      }
    }
  }, [beepError, runningNodeId, nodes, updateNode, updateNodeStatus, addTimelineEvent, addConsoleMessage]);

  const handleRunNode = useCallback(async (nodeId: string, inputData?: any) => {
    const nodeToRun = nodes.find(n => n.id === nodeId);
    if (!nodeToRun) return;

    if (nodeToRun.config?.beepEmotion) eventBus.emit('beep:setEmotion', nodeToRun.config.beepEmotion);

    updateNodeStatus(nodeId, 'running');
    addTimelineEvent({ type: 'node_running', message: `Executing node: ${nodeToRun.title}`, nodeId, nodeTitle: nodeToRun.title });
    
    let prompt = '';
    const promptInput = inputData ? `\n\nUse the following data as input for your task:\n${JSON.stringify(inputData)}` : '';
    
    switch (nodeToRun.type) {
      case 'web-summarizer':
        prompt = `Please summarize the content from this URL: ${nodeToRun.config?.url}`;
        break;
      case 'prompt':
      case 'agent-call':
        prompt = (nodeToRun.config?.promptText || `Execute generic prompt for node ${nodeToRun.title}`) + promptInput;
        break;
      case 'data-transform':
        prompt = `Please execute a data transformation with the following logic: "${nodeToRun.config?.transformationLogic}".` + promptInput;
        break;
      case 'conditional':
        prompt = `Please evaluate the condition: "${nodeToRun.config?.condition}".` + promptInput;
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

  // Centralized hook for processing agent results and updating node state
  useEffect(() => {
    if (isBeepLoading || !runningNodeId) {
        return;
    }
    
    const lastMessage = beepMessages[beepMessages.length - 1];
    if (!lastMessage) return;

    const runningNode = nodes.find(n => n.id === runningNodeId);
    if (!runningNode) return;

    let resultOutput: any = null;
    let nodeSucceeded = false;

    // Case 1: The last message is a tool result for a server-side tool.
    if (lastMessage.role === 'tool') {
        try {
            resultOutput = JSON.parse(lastMessage.content as string);
            if(resultOutput.isClientSide) {
                // This was a client-side tool call, not the end of a server node execution.
                resultOutput = null; 
            } else {
               nodeSucceeded = resultOutput?.error ? false : true;
            }
        } catch (e) {
            resultOutput = { error: "Failed to parse tool result." };
            nodeSucceeded = false;
        }
    }
    // Case 2: The last message is a simple text response from the assistant, meaning the node is done.
    else if (lastMessage.role === 'assistant' && !lastMessage.tool_calls?.length) {
        resultOutput = { result: lastMessage.content };
        nodeSucceeded = true;
    }
    
    // If we have a conclusive result for the running node, update its state.
    if (resultOutput) {
        const newStatus = nodeSucceeded ? 'completed' : 'failed';
        updateNode(runningNode.id, {
            status: newStatus,
            config: { ...runningNode.config, output: resultOutput }
        });
        updateNodeStatus(runningNode.id, newStatus);
        addTimelineEvent({
            type: nodeSucceeded ? 'node_completed' : 'node_failed',
            message: nodeSucceeded ? `Node finished successfully.` : `Node failed: ${resultOutput.error || 'Unknown error'}`,
            nodeId: runningNode.id,
            nodeTitle: runningNode.title,
        });
    }
  }, [beepMessages, isBeepLoading, runningNodeId, nodeExecutionStatus, nodes, updateNode, updateNodeStatus, addTimelineEvent, addConsoleMessage]);

  useEffect(() => {
    if (!isWorkflowRunning) {
      prevNodeStatusRef.current = {};
      return;
    }

    const newlyCompletedNodes = nodes.filter(node => 
      nodeExecutionStatus[node.id] === 'completed' &&
      prevNodeStatusRef.current[node.id] !== 'completed'
    );

    if (newlyCompletedNodes.length > 0) {
      newlyCompletedNodes.forEach(completedNode => {
        const nextConnections = connections.filter(c => c.from === completedNode.id);
        if (nextConnections.length === 0) return;
        
        nextConnections.forEach(conn => {
          const nextNode = nodes.find(n => n.id === conn.to);
          if (nextNode) {
            updateNodeStatus(nextNode.id, 'queued');
            handleRunNode(nextNode.id, completedNode.config?.output);
          }
        });
      });
    }
    
    prevNodeStatusRef.current = { ...nodeExecutionStatus };

    const isFinished = !Object.values(nodeExecutionStatus).some(
      status => status === 'running' || status === 'queued'
    );
    
    const hasStarted = Object.keys(nodeExecutionStatus).length > 0;

    if (hasStarted && isFinished) {
      setIsWorkflowRunning(false);
      toast({ title: 'Workflow Finished', description: `Execution of "${workflowName}" is complete.` });
      addTimelineEvent({ type: 'workflow_completed', message: 'Workflow execution finished.' });
    }

  }, [nodeExecutionStatus, isWorkflowRunning, nodes, connections, updateNodeStatus, handleRunNode, addTimelineEvent, toast, workflowName]);


  const handleRunWorkflow = useCallback(() => {
    if (nodes.length === 0) {
      toast({ title: "Empty Workflow", description: "Add nodes to the canvas before running.", variant: 'destructive' });
      return;
    }
    setIsWorkflowRunning(true);
    addConsoleMessage('info', `User initiated workflow execution for "${workflowName}".`);
    addTimelineEvent({ type: 'workflow_start', message: `Workflow "${workflowName}" started.` });
    
    const initialStatuses: Record<string, NodeStatus> = {};
    nodes.forEach(n => initialStatuses[n.id] = 'pending');
    
    const startNodes = nodes.filter(n => !connections.some(c => c.to === n.id));
    
    if (startNodes.length === 0 && nodes.length > 0) {
        toast({ title: "Execution Error", description: "No starting node found. Check for circular dependencies.", variant: 'destructive' });
        setIsWorkflowRunning(false);
        return;
    }

    startNodes.forEach(n => {
        initialStatuses[n.id] = 'queued';
        addTimelineEvent({ type: 'node_queued', message: `Starting node "${n.title}" queued.`, nodeId: n.id, nodeTitle: n.title });
        handleRunNode(n.id);
    });

    setNodeExecutionStatus(initialStatuses);

  }, [nodes, connections, workflowName, addConsoleMessage, addTimelineEvent, toast, handleRunNode, setNodeExecutionStatus]);

  const handleNodeDropped = (newNodeData: Omit<WorkflowNodeData, 'id' | 'status'> & { status?: NodeStatus }) => {
    const newNode = addNode(newNodeData);
    setSelectedNodeId(newNode.id);
    addConsoleMessage('log', `Node "${newNode.title}" (ID: ${newNode.id}) added to canvas.`);
    addTimelineEvent({
      nodeId: newNode.id,
      nodeTitle: newNode.title,
      type: 'info',
      message: `Node "${newNode.title}" added.`
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

    let userResponseText = `User response for request ${requestId}: ${responseStatus}.`;
    if (responseStatus === 'responded' && details) {
        userResponseText += ` Details: "${details}"`;
    }
    
    beepAppend({ role: 'user', content: userResponseText });
    
    toast({ title: 'Response Sent', description: `Your response '${responseStatus}' has been sent to the agent.`})
  };

  const anyMobilePanelOpen = isMobile && Object.values(panelVisibility).some(v => v);

  if (isMobile) {
    return (
      <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
        <main className={`flex-1 relative flex overflow-hidden p-0 pb-16`}>
           <div className={`flex-1 h-full transition-opacity duration-300 ${anyMobilePanelOpen ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
              <CanvasZone {...{workflowName, nodes, connections, onNodeDropped: handleNodeDropped, selectedNode, onNodeSelected: handleNodeSelected, nodeExecutionStatus, onInputPortClick: handleInputPortClick, onOutputPortClick: handleOutputPortClick, connectingState, onRunWorkflow: handleRunWorkflow, isWorkflowRunning}} />
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
                <CanvasZone {...{workflowName, nodes, connections, onNodeDropped: handleNodeDropped, selectedNode, onNodeSelected: handleNodeSelected, nodeExecutionStatus, onInputPortClick: handleInputPortClick, onOutputPortClick: handleOutputPortClick, connectingState, onRunWorkflow: handleRunWorkflow, isWorkflowRunning}} />
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

    