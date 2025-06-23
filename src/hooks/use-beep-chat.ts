
import { useChat, type ToolCallHandler } from 'ai/react';
import eventBus from '@/lib/event-bus';
import { useLayoutStore } from '@/stores/layout.store';
import type { Message } from 'ai';
import { useEffect } from 'react';
import { useToast } from './use-toast';

export function useBeepChat() {
    const { toast } = useToast();

    // The tool call handler is now defined here and passed to the useChat hook.
    // This is the correct pattern for handling client-side tool execution.
    const handleToolCall: ToolCallHandler = async (chatMessages, toolCalls) => {
        const layoutActions = useLayoutStore.getState();
        let toolCallResults: any[] = [];
        
        for (const toolCall of toolCalls) {
            let result: any;
            const taskName = `BEEP: ${toolCall.toolName}`;
            let status: 'success' | 'failure' = 'success';
            let details = `Tool ${toolCall.toolName} executed successfully.`;

            try {
                // This switch handles all client-side UI manipulation tools.
                switch (toolCall.toolName) {
                    case 'focusItem':
                        layoutActions.bringToFront(toolCall.args.instanceId);
                        details = `Focused on item: ${toolCall.args.instanceId}`;
                        break;
                    case 'addItem':
                        layoutActions.addCard(toolCall.args.itemId);
                        details = `Adding item: ${toolCall.args.itemId}`;
                        break;
                    case 'moveItem':
                        layoutActions.moveItem(toolCall.args.instanceId, { x: toolCall.args.x, y: toolCall.args.y });
                        details = `Moving item: ${toolCall.args.itemId}`;
                        break;
                    case 'removeItem':
                        layoutActions.closeItem(toolCall.args.instanceId);
                        details = `Removing item: ${toolCall.args.instanceId}`;
                        break;
                    case 'closeAllInstancesOfApp':
                        layoutActions.closeAllInstancesOfApp(toolCall.args.appId);
                        details = `Closing all instances of: ${toolCall.args.appId}`;
                        break;
                    case 'resetLayout':
                        layoutActions.resetLayout();
                        details = `Resetting dashboard layout.`;
                        break;
                    default:
                        // If the tool is not meant for the client, we throw an error.
                        // The agent should be configured to only send client-side tool calls here.
                        throw new Error(`Unknown client-side tool: ${toolCall.toolName}`);
                }
                result = { success: true, message: details };
            } catch (error: any) {
                result = { error: error.message };
                status = 'failure';
                details = error.message;
            }

            // Log the outcome of the action to the orchestration feed.
            eventBus.emit('orchestration:log', { task: taskName, status, details });
            
            toolCallResults.push({
                tool_call_id: toolCall.toolCallId,
                result: result
            });
        }
        
        // This helper function on the useChat hook sends the tool results back to the server
        // so the agent can continue its reasoning process.
        return chatMessages.concat({
            role: 'tool',
            content: JSON.stringify(toolCallResults),
        });
    };
    
    const { messages, append, isLoading, setMessages } = useChat({
        api: '/api/ai/chat',
        // The onToolCall handler is correctly passed here.
        experimental_onToolCall: handleToolCall,
        onFinish: (message) => {
            // onFinish is a more reliable way to know the stream is complete.
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
