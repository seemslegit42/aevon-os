
import { useChat, type ToolCallHandler } from 'ai/react';
import eventBus from '@/lib/event-bus';
import { useLayoutStore } from '@/stores/layout.store';
import type { Message } from 'ai';
import { useEffect } from 'react';
import { useToast } from './use-toast';

export function useBeepChat() {
    const { toast } = useToast();

    // This is the handler for client-side tools. It receives tool calls from the AI
    // and executes them by calling actions on the Zustand layout store.
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
                    case 'moveItem':
                        layoutActions.moveItem(args.instanceId as string, { x: args.x as number, y: args.y as number });
                        details = `Moving item: ${args.instanceId}`;
                        break;
                    case 'removeItem':
                        layoutActions.closeItem(args.instanceId as string);
                        details = `Removing item: ${args.instanceId}`;
                        break;
                    case 'closeAllInstancesOfApp':
                        layoutActions.closeAllInstancesOfApp(args.appId as string);
                        details = `Closing all instances of: ${args.appId}`;
                        break;
                    case 'resetLayout':
                        layoutActions.resetLayout();
                        details = `Resetting dashboard layout.`;
                        break;
                    default:
                        // This case should ideally not be hit if the agent is configured correctly
                        // to only send client-side tools to the client.
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

            // Append the result of the tool call to the chat history.
            // This is crucial for the agent to know the tool was executed.
            chatMessages.push({
                role: 'tool',
                content: JSON.stringify(result),
                tool_call_id: toolCall.toolCallId,
            });
        }
        
        return chatMessages;
    };
    
    const { messages, append, isLoading, setMessages } = useChat({
        api: '/api/ai/chat',
        experimental_onToolCall: handleToolCall,
        onFinish: (message) => {
            if (message.role === 'assistant' && message.content && !message.tool_calls) {
                const plainTextContent = message.content.replace(/`+/g, '');
                eventBus.emit('beep:response', plainTextContent);
            }
        }
    });

    const layoutItems = useLayoutStore(state => state.layoutItems);
    
    // This effect listens for external query submissions (e.g., from other components)
    useEffect(() => {
        const handleQuerySubmit = (query: string) => {
            if (query) {
                append({ role: 'user', content: query }, { options: { body: { layoutItems } } });
            }
        };
        eventBus.on('beep:submitQuery', handleQuerySubmit);
        return () => {
            eventBus.off('beep:submitQuery', handleQuerySubmit);
        };
    }, [append, layoutItems]);

  return {
    messages,
    append: (message: Message) => append(message, { options: { body: { layoutItems } } }),
    isLoading,
    setMessages,
    lastMessage: messages[messages.length - 1],
  };
}
