
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
import eventBus from '@/lib/event-bus';
import { exampleTemplates } from '@/app/loom/data/templates';
import { useLoomStore } from '@/stores/loom.store';
import { cn } from '@/lib/utils';
import { shallow } from 'zustand/shallow';
import { BottomBar } from './components/layout/bottom-bar';
import { useActionRequestStore } from '@/stores/action-request.store';
import { useBeepChatStore } from '@/stores/beep-chat.store';
import { useLoomOrchestrator } from '@/hooks/use-loom-orchestrator';


import type {
  WorkflowNodeData,
  PanelVisibility,
  ConnectingState,
  AiGeneratedFlowData,
  ConsoleMessage,
  WorkflowTemplate,
  Connection,
} from '@/types/loom';


export default function LoomStudioPage() {
  const {
    nodes, connections, selectedNodeId, consoleMessages, timelineEvents,
    workflowName, nodeExecutionStatus,
    setWorkflow, setSelectedNodeId, updateNode, deleteNode, addNode, addConnection,
    clearWorkflow, addConsoleMessage, addTimelineEvent, clearConsole,
  } = useLoomStore(state => ({...state}), shallow);
  
  const { requests: actionRequests, resolveActionRequest } = useActionRequestStore(state => ({
    requests: state.requests,
    resolveActionRequest: state.resolveActionRequest,
  }), shallow);

  const { isWorkflowRunning, handleRunWorkflow, handleRunNode } = useLoomOrchestrator();

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
    
    const { append: beepAppend } = useBeepChatStore.getState();
    resolveActionRequest(requestId, responseStatus, details);

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
                        {panelKey === 'palette' && <PalettePanel className="h-full" onClose={() => togglePanel('palette')} isMobile />}
                        {panelKey === 'inspector' && <TooltipProvider delayDuration={300}><InspectorPanel key={selectedNode?.id || 'inspector-mobile-empty'} className="h-full overflow-y-auto" onClose={() => togglePanel('inspector')} {...{selectedNode, onNodeUpdate: handleNodeUpdate, onNodeDelete: handleDeleteNode, isMobile, onRunNode: handleRunNode, isNodeRunning}} /></TooltipProvider>}
                        {panelKey === 'agentHub' && <AgentHubPanel className="h-full" onClose={() => togglePanel('agentHub')} {...{addConsoleMessage, addTimelineEvent, isMobile}} />}
                        {panelKey === 'actionConsole' && <ActionConsolePanel className="h-full" requests={actionRequests} onRespond={handleAgentActionResponse} onClose={() => togglePanel('actionConsole')} isMobile />}
                        {panelKey === 'timeline' && <TimelinePanel className="h-full" onClose={() => togglePanel('timeline')} events={timelineEvents} isMobile />}
                        {panelKey === 'console' && <ConsolePanel className="h-full" onClose={() => togglePanel('console')} messages={consoleMessages.filter(msg => consoleFilters[msg.type])} filters={consoleFilters} onToggleFilter={(type) => setConsoleFilters(f => ({ ...f, [type]: !f[type]}))} onClearConsole={clearConsole} isMobile />}
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
                 <ActionConsolePanel className={cn(!panelVisibility.actionConsole && "hidden")} onClose={() => togglePanel('actionConsole')} requests={actionRequests} onRespond={handleAgentActionResponse} />
              </ResizableVerticalPanes>
            </ResizableHorizontalPanes>
          </ResizableHorizontalPanes>
        </TooltipProvider>
        <TemplateSelectorDialog isOpen={isTemplateSelectorOpen} onClose={() => setIsTemplateSelectorOpen(false)} templates={exampleTemplates} onLoadTemplate={handleLoadTemplate} />
      </main>
    </div>
  );
}
