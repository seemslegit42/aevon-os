'use client';

import { useEffect, useCallback } from 'react';
import { useChat, type ToolCallHandler, type Message } from 'ai/react';
import { useLayoutStore } from '@/stores/layout.store';
import { useToast } from '@/hooks/use-toast';
import { useBeepChatStore } from '@/stores/beep-chat.store';
import eventBus from '@/lib/event-bus';
import { useLoomStore } from '@/stores/loom.store';
import { usePathname } from 'next/navigation';
import { ALL_MICRO_APPS } from '@/config/dashboard-cards.config';
import { shallow } from 'zustand/shallow';

/**
 * This is a non-rendering component that initializes the Vercel `useChat` hook
 * and keeps its state synchronized with our global Zustand store (`useBeepChatStore`).
 * This allows any component in the app to access the BEEP chat state and actions
 * without needing to instantiate the hook itself, ensuring a single, shared chat session.
 */
export function BeepChatProvider() {
  const { toast } = useToast();

  const handleToolCall: ToolCallHandler = async (chatMessages, toolCalls) => {
    const layoutActions = useLayoutStore.getState();

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
        // When the AI finishes generating a response, if it's a simple text response
        // (not a tool call), emit an event for the TTS hook to pick up.
        if (message.role === 'assistant' && message.content && !message.tool_calls?.length) {
            const plainTextContent = message.content.replace(/`+/g, '');
            eventBus.emit('beep:response', plainTextContent);
        }
    }
  });

  const pathname = usePathname();
  const { layoutItems, focusedItemId } = useLayoutStore(state => ({
      layoutItems: state.layoutItems,
      focusedItemId: state.focusedItemId,
  }), shallow);
  
  // Create a custom 'append' function that always includes the latest layout and app context.
  const appendWithContext = useCallback(async (message: Message) => {
    let activeMicroApp: { id: string; name: string; description: string } | undefined = undefined;

    if (focusedItemId) {
        const focusedItem = layoutItems.find(item => item.id === focusedItemId);
        if (focusedItem && focusedItem.type === 'app' && focusedItem.appId) {
            const appConfig = ALL_MICRO_APPS.find(app => app.id === focusedItem.appId);
            if (appConfig) {
                activeMicroApp = {
                    id: appConfig.id,
                    name: appConfig.title,
                    description: appConfig.description,
                };
            }
        }
    }

    const { nodes, connections, selectedNodeId } = useLoomStore.getState();
    const loomState = nodes.length > 0 ? { nodes, connections, selectedNodeId } : undefined;

    return originalAppend(message, {
      options: { 
        body: { 
            layoutItems: layoutItems,
            loomState,
            currentRoute: pathname,
            activeMicroApp,
        } 
      }
    });
  }, [pathname, layoutItems, focusedItemId, originalAppend]);

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

  return null; // This component does not render anything
}
