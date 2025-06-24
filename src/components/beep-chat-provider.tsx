
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


  // The useEffect hook for processing tool results has been removed.
  // This logic is now centralized in components that initiate AI tasks.

  return null; // This component does not render anything
}

    