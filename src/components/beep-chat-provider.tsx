
'use client';

import { useEffect } from 'react';
import { useChat, type ToolCallHandler, type Message } from 'ai/react';
import { useLayoutStore } from '@/stores/layout.store';
import { useToast } from '@/hooks/use-toast';
import { useBeepChatStore } from '@/stores/beep-chat.store';
import eventBus from '@/lib/event-bus';

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
      let status: 'success' | 'failure' = 'success';
      let details = result.message;

      try {
        switch (toolName) {
            case 'focusItem':
                layoutActions.bringToFront(args.instanceId as string);
                details = `Focused on item: ${args.instanceId}`;
                break;
            case 'addItem':
                layoutActions.addCard(args.itemId as string);
                details = `Adding item: ${args.itemId}`;
                break;
            case 'removeItem':
                layoutActions.closeItem(args.instanceId as string);
                details = `Removing item: ${args.instanceId}`;
                break;
            case 'resetLayout':
                layoutActions.resetLayout();
                details = `Resetting dashboard layout.`;
                break;
            default:
                // This case should ideally not be hit if the agent is configured correctly
                // to only send client-side tools to the client. This tool call will be passed
                // back to the agent to be handled on the server.
                continue;
        }
        result = { success: true, message: details };

      } catch (error: any) {
        result = { error: error.message };
        status = 'failure';
        details = error.message;
        toast({ variant: 'destructive', title: `UI Action Failed: ${toolName}`, description: details });
      }

      eventBus.emit('orchestration:log', { task: `BEEP: ${toolName}`, status, details });
      
      chatMessages.push({
        role: 'tool',
        content: JSON.stringify(result),
        tool_call_id: toolCall.toolCallId,
      });
    }
    
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
        if (message.role === 'assistant' && message.content && !message.tool_calls) {
            const plainTextContent = message.content.replace(/`+/g, '');
            eventBus.emit('beep:response', plainTextContent);
        }
    }
  });
  
  // Custom append function that always includes the latest layout context
  const appendWithContext = async (message: Message) => {
    const currentLayout = useLayoutStore.getState().layoutItems;
    return originalAppend(message, {
      options: { body: { layout: currentLayout } }
    });
  };

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
    reload, stop
  ]);

  return null; // This component does not render anything
}
