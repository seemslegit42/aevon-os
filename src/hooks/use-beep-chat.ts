
import { useChat } from 'ai/react';
import eventBus from '@/lib/event-bus';
import { useLayoutStore } from '@/stores/layout.store';

export function useBeepChat() {
    const { messages, append, isLoading, setMessages, lastMessage } = useChat({
    api: '/api/ai/chat',
    async onToolCall(toolCalls) {
      // Get the layout store actions *once* for this batch of tool calls.
      const layoutActions = useLayoutStore.getState();

      const toolCallResults = toolCalls.map((toolCall) => {
        const { toolName, args } = toolCall;
        let result: any;
        const taskName = `BEEP: ${toolName}`;
        let status: 'success' | 'failure' = 'success';
        let details = `Tool ${toolName} executed successfully.`;

        try {
          // This switch handles all client-side UI manipulation tools.
          // Instead of emitting events, it now calls actions directly on the layout store.
          switch (toolName) {
              case 'focusItem':
                  layoutActions.bringToFront((args as { instanceId: string }).instanceId);
                  details = `Focused on item: ${(args as { instanceId: string }).instanceId}`;
                  break;
              case 'addItem':
                  const { itemId } = args as { itemId: string };
                  layoutActions.addCard(itemId);
                  details = `Adding item: ${itemId}`;
                  break;
              case 'moveItem':
                  layoutActions.moveItem((args as any).instanceId, { x: (args as any).x, y: (args as any).y });
                  details = `Moving item: ${args.itemId}`;
                  break;
              case 'removeItem':
                  layoutActions.closeItem((args as { instanceId: string }).instanceId);
                  details = `Removing item: ${(args as { instanceId: string }).instanceId}`;
                  break;
              case 'closeAllInstancesOfApp':
                  layoutActions.closeAllInstancesOfApp((args as { appId: string }).appId);
                  details = `Closing all instances of: ${(args as { appId: string }).appId}`;
                  break;
              case 'resetLayout':
                  layoutActions.resetLayout();
                  details = `Resetting dashboard layout.`;
                  break;
              default:
                  // This tool is not handled on the client, so it will be sent back
                  // to the server for server-side execution.
                  return null;
          }
          result = { success: true, message: details };
        } catch (error: any) {
          result = { error: error.message };
          status = 'failure';
          details = error.message;
        }

        // Log the outcome of the action to the orchestration feed.
        eventBus.emit('orchestration:log', { task: taskName, status, details });
        return { ...toolCall, result };
      });
      
      // Filter out any null results (server-side tools) and return the rest.
      return toolCallResults.filter(Boolean);
    },
    onFinish: (message) => {
      // onFinish is a more reliable way to know the stream is complete.
      if (message.role === 'assistant' && message.content && !message.tool_calls) {
        const plainTextContent = message.content.replace(/`+/g, '');
        eventBus.emit('beep:response', plainTextContent);
      }
    }
  });

  return {
    messages,
    append,
    isLoading,
    setMessages,
    lastMessage: messages[messages.length - 1],
  };
}
