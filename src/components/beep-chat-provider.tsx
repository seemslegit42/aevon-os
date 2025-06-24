'use client';

import { useEffect, useCallback } from 'react';
import { useChat, type ToolCallHandler, type Message } from 'ai/react';
import { useToast } from '@/hooks/use-toast';
import { useBeepChatStore } from '@/stores/beep-chat.store';
import eventBus from '@/lib/event-bus';
import { usePathname } from 'next/navigation';
import { useLayoutStore } from '@/stores/layout.store';
import { useLoomStore } from '@/stores/loom.store';
import { ALL_MICRO_APPS } from '@/config/app-registry';
import { type InvoiceData } from '@/lib/ai-schemas';
import type { AvatarState } from '@/types/dashboard';

/**
 * This is a non-rendering component that initializes the Vercel `useChat` hook
 * and keeps its state synchronized with our global Zustand store (`useBeepChatStore`).
 * This allows any component in the app to access the BEEP chat state and actions
 * without needing to instantiate the hook itself, ensuring a single, shared chat session.
 */
export function BeepChatProvider() {
  const { toast } = useToast();

  const handleToolCall: ToolCallHandler = async (chatMessages, toolCalls) => {
    // Dynamic import to break circular dependency
    const { useLayoutStore } = await import('@/stores/layout.store');
    const { useLoomStore } = await import('@/stores/loom.store');
    const layoutActions = useLayoutStore.getState();
    const loomActions = useLoomStore.getState();

    for (const toolCall of toolCalls) {
      const { toolName, args } = toolCall;
      let result: any = { success: true, message: `Tool ${toolName} executed.` };

      // This handler only executes client-side UI manipulation tools.
      // Server-side tools are filtered out by the agent and handled on the backend.
      try {
        switch (toolName) {
            case 'focusItem':
                layoutActions.bringToFront(args.instanceId as string);
                result.message = `Focused on item: ${args.instanceId}`;
                break;
            case 'addItem':
                layoutActions.addCard(args.itemId as string);
                result.message = `Adding item: ${args.itemId}`;
                break;
            case 'removeItem':
                layoutActions.closeItem(args.instanceId as string);
                result.message = `Removing item: ${args.instanceId}`;
                break;
            case 'resetLayout':
                layoutActions.resetLayout();
                result.message = `Resetting dashboard layout.`;
                break;
            case 'requestHumanAction':
                loomActions.addActionRequest({
                    agentName: "BEEP", // Or dynamically get from agent context
                    requestType: args.requestType as any,
                    message: args.message as string,
                    requiresInput: args.requiresInput as boolean | undefined,
                    inputPrompt: args.inputPrompt as string | undefined,
                });
                // When asking for human input, we don't immediately add a tool result.
                // The workflow will pause here until the user responds.
                continue;
            default:
                // If the tool is not a known client-side tool, we skip it.
                // It will be sent back to the server for processing in the next turn.
                continue;
        }

      } catch (error: any) {
        result = { error: true, message: error.message };
        toast({ variant: 'destructive', title: `UI Action Failed: ${toolName}`, description: result.message });
      }
      
      // Add the result of the tool call to the chat history
      chatMessages.push({
        role: 'tool',
        content: JSON.stringify(result),
        tool_call_id: toolCall.toolCallId,
      });
    }
    
    // Return the updated messages, including tool results
    return chatMessages;
  };

  const {
    messages,
    error,
    isLoading,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    append: originalAppend,
    setMessages,
    reload,
    stop,
  } = useChat({
    api: '/api/ai/chat',
    experimental_onToolCall: handleToolCall,
    onFinish: (message) => {
        if (message.role === 'assistant') {
            // Set avatar emotion based on AI's decision from metadata
            const emotion = message.additional_kwargs?.emotion as AvatarState | undefined;
            if (emotion && emotion.startsWith('speaking_')) {
                useBeepChatStore.getState().setAvatarState(emotion);
            }

            // When the AI finishes generating a response, if it's a simple text response
            // (not a tool call), emit an event for the TTS hook to pick up.
            if (message.content && !message.tool_calls?.length) {
                const plainTextContent = message.content.replace(/`+/g, '');
                eventBus.emit('beep:response', plainTextContent);
                eventBus.emit('loom:node-result', { content: plainTextContent });
            }
        }
    }
  });

  const pathname = usePathname();
  
  // Create a custom 'append' function that always includes the latest layout and app context.
  const appendWithContext = useCallback(async (message: Message) => {
    const { layoutItems, focusedItemId } = useLayoutStore.getState();
    const { nodes, connections, selectedNodeId } = useLoomStore.getState();
    const loomState = nodes.length > 0 ? { nodes, connections, selectedNodeId } : undefined;

    // Determine active app persona based on focused window
    const focusedItem = focusedItemId ? layoutItems.find(item => item.id === focusedItemId) : null;
    let activeMicroAppPersona = null;
    if (focusedItem?.type === 'app' && focusedItem.appId) {
        const appConfig = ALL_MICRO_APPS.find(app => app.id === focusedItem.appId);
        if (appConfig?.persona) {
            activeMicroAppPersona = appConfig.persona;
        }
    }

    return originalAppend(message, {
      options: { 
        body: { 
            layoutItems: layoutItems,
            loomState: loomState,
            currentRoute: pathname,
            activeMicroAppPersona: activeMicroAppPersona,
        } 
      }
    });
  }, [pathname, originalAppend]);

  // Sync the hook's state with the Zustand store
  useEffect(() => {
    useBeepChatStore.setState({
      messages,
      error,
      isLoading,
      input,
      setInput,
      handleInputChange,
      handleSubmit,
      append: appendWithContext,
      setMessages,
      reload,
      stop,
    });
  }, [
    messages, error, isLoading, input, setInput,
    handleInputChange, handleSubmit, setMessages,
    reload, stop, appendWithContext
  ]);

   // Effect to process server-side tool results and emit events
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role !== 'tool') return;

    // Find the original assistant message that triggered this tool call
    const assistantMessage = messages.slice().reverse().find(
        m => m.role === 'assistant' && m.tool_calls?.some(tc => tc.toolCallId === lastMessage.tool_call_id)
    );

    if (!assistantMessage || !assistantMessage.tool_calls) return;

    const toolCall = assistantMessage.tool_calls.find(tc => tc.toolCallId === lastMessage.tool_call_id);
    if (!toolCall) return;

    try {
        const toolName = toolCall.toolName;
        // Ignore client-side tool results for this effect
        const result = JSON.parse(lastMessage.content as string);
        if (result.isClientSide) return;

        if (result.error) {
            console.error(`Tool call ${toolName} failed:`, result.message);
            eventBus.emit('tool:error', { toolName });
            return;
        }

        eventBus.emit('tool:success', { toolName });
        
        // After successfully processing a tool, maybe trigger a random security event
        if (Math.random() < 0.25) { // 25% chance
            const mockAlert = {
                timestamp: new Date().toISOString(),
                source: 'core.network.firewall',
                type: 'Suspicious_Login_Attempt',
                details: `Unrecognized IP 172.16.254.1 attempted to access sensitive resource '${toolName}'.`
            };
            eventBus.emit('aegis:new-alert', JSON.stringify(mockAlert));
        }

        // Emit specific events for different tools
        switch (toolName) {
            case 'analyzeSecurityAlert':
                eventBus.emit('aegis:analysis-result', result);
                break;
            case 'getSalesAnalyticsData':
                eventBus.emit('sales-analytics:update', result);
                break;
            case 'summarizeWebpage':
                eventBus.emit('websummarizer:result', result);
                break;
            case 'generateMarketingContent':
                eventBus.emit('content:result', result);
                break;
            case 'extractInvoiceData':
                eventBus.emit('accounting:invoice-extracted', result as InvoiceData);
                break;
            case 'runLoomWorkflow':
                if (result.events && Array.isArray(result.events)) {
                    result.events.forEach((event: any) => {
                        eventBus.emit(event.eventName as any, event.payload);
                    });
                }
                break;
            // Add more cases here for other tools that need to update the UI
        }

    } catch (e) {
        console.error("Failed to parse or process tool result:", e);
    }
  }, [messages]);


  return null; // This component does not render anything
}
