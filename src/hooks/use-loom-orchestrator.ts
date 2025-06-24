
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useLoomStore } from '@/stores/loom.store';
import { useBeepChat } from '@/hooks/use-beep-chat';
import { useToast } from '@/hooks/use-toast';
import eventBus from '@/lib/event-bus';
import { shallow } from 'zustand/shallow';

import type { WorkflowNodeData, NodeStatus, Connection } from '@/types/loom';

export function useLoomOrchestrator() {
  const { toast } = useToast();
  const { append: beepAppend, messages: beepMessages, isLoading: isBeepLoading, error: beepError } = useBeepChat();
  
  const { 
    nodes, connections, workflowName, nodeExecutionStatus,
    updateNode, updateNodeStatus, setNodeExecutionStatus, addTimelineEvent, addConsoleMessage
  } = useLoomStore(state => ({
    nodes: state.nodes,
    connections: state.connections,
    workflowName: state.workflowName,
    nodeExecutionStatus: state.nodeExecutionStatus,
    updateNode: state.updateNode,
    updateNodeStatus: state.updateNodeStatus,
    setNodeExecutionStatus: state.setNodeExecutionStatus,
    addTimelineEvent: state.addTimelineEvent,
    addConsoleMessage: state.addConsoleMessage,
  }), shallow);

  const [isWorkflowRunning, setIsWorkflowRunning] = useState(false);
  const prevNodeStatusRef = useRef<Record<string, NodeStatus>>({});
  
  const runningNodeId = Object.keys(nodeExecutionStatus).find(
    (id) => nodeExecutionStatus[id] === 'running'
  );

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
        prompt = `Please evaluate the condition: "${nodeToRun.config?.condition}". Return only a JSON object with a single boolean 'result' key, like \`{"result": true}\`.` + promptInput;
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
  
  // Effect for handling BEEP API errors
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

  // Effect for processing BEEP results and updating node state
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

    if (lastMessage.role === 'tool') {
        try {
            resultOutput = JSON.parse(lastMessage.content as string);
            if(resultOutput.isClientSide) {
                resultOutput = null; 
            } else {
               nodeSucceeded = resultOutput?.error ? false : true;
            }
        } catch (e) {
            resultOutput = { error: "Failed to parse tool result." };
            nodeSucceeded = false;
        }
    }
    else if (lastMessage.role === 'assistant' && !lastMessage.tool_calls?.length) {
        let content = lastMessage.content;
        try {
          const parsedJson = JSON.parse(content);
          resultOutput = parsedJson;
        } catch (e) {
          resultOutput = { result: content };
        }
        nodeSucceeded = true;
    }
    
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
  }, [beepMessages, isBeepLoading, runningNodeId, nodes, updateNode, updateNodeStatus, addTimelineEvent]);

  // Effect for orchestrating the workflow execution from one node to the next
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
        const allOutgoingConnections = connections.filter(c => c.from === completedNode.id);
        if (allOutgoingConnections.length === 0) return;
  
        let connectionsToFollow: Connection[] = [];
  
        if (completedNode.type === 'conditional') {
          const result = !!completedNode.config?.output?.result;
          addConsoleMessage('info', `Conditional node "${completedNode.title}" evaluated to: ${result}`);
  
          if (result && allOutgoingConnections.length > 0) {
            connectionsToFollow.push(allOutgoingConnections[0]);
          } else if (!result && allOutgoingConnections.length > 1) {
            connectionsToFollow.push(allOutgoingConnections[1]);
          }
        } else {
          connectionsToFollow = allOutgoingConnections;
        }
  
        connectionsToFollow.forEach(conn => {
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
      const hasFailures = Object.values(nodeExecutionStatus).some(s => s === 'failed');
      toast({ 
        title: 'Workflow Finished', 
        description: `Execution of "${workflowName}" is complete.`,
        variant: hasFailures ? 'destructive' : 'default',
      });
      addTimelineEvent({ type: hasFailures ? 'workflow_failed' : 'workflow_completed', message: 'Workflow execution finished.' });
    }
  
  }, [nodeExecutionStatus, isWorkflowRunning, nodes, connections, updateNodeStatus, handleRunNode, addTimelineEvent, toast, workflowName, addConsoleMessage]);

  return {
    isWorkflowRunning,
    handleRunWorkflow,
    handleRunNode,
  };
}
