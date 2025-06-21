
import { useChat } from 'ai/react';
import eventBus from '@/lib/event-bus';

export function useBeepChat() {
    const { messages, append, isLoading, setMessages, lastMessage } = useChat({
    api: '/api/ai/chat',
    onToolCall: async (toolCalls) => {
      // All tools for BEEP are handled client-side by emitting events.
      // The event bus listeners (in useDashboardLayout) will then update the Zustand store.
      const toolCallResults = toolCalls.map((toolCall) => {
        const { toolName, args } = toolCall;
        let result: any;
        const taskName = `BEEP: ${toolName}`;
        let status: 'success' | 'failure' = 'success';
        let details = `Tool ${toolName} executed successfully.`;

        try {
          switch (toolName) {
              case 'focusItem':
                  eventBus.emit('panel:focus', (args as { instanceId: string }).instanceId);
                  details = `Focused on item: ${(args as { instanceId: string }).instanceId}`;
                  break;
              case 'addItem':
                  // This tool is smart enough to handle both cards and apps.
                  const { itemId } = args as { itemId: string };
                  eventBus.emit('panel:add', itemId); // This will add cards or launch apps via config
                  details = `Adding item: ${itemId}`;
                  break;
              case 'moveItem':
                  eventBus.emit('item:move', args as { itemId: string, x: number, y: number });
                  details = `Moving item: ${args.itemId}`;
                  break;
              case 'removeItem':
                  eventBus.emit('panel:remove', (args as { instanceId: string }).instanceId);
                  details = `Removing item: ${(args as { instanceId: string }).instanceId}`;
                  break;
              case 'closeAllInstancesOfApp':
                  eventBus.emit('app:closeAll', (args as { appId: string }).appId);
                  details = `Closing all instances of: ${(args as { appId: string }).appId}`;
                  break;
              case 'resetLayout':
                  eventBus.emit('layout:reset');
                  details = `Resetting dashboard layout.`;
                  break;
              default:
                  // This is not a recognized client-side tool.
                  // It will be sent back to the server for server-side tool execution.
                  return null;
          }
          result = { success: true, message: details };
        } catch (error: any) {
          result = { error: error.message };
          status = 'failure';
          details = error.message;
        }

        eventBus.emit('orchestration:log', { task: taskName, status, details });
        return { ...toolCall, result };
      });
      
      // Filter out any null results (server-side tools)
      return toolCallResults.filter(Boolean);
    },
  });

  return {
    messages,
    append,
    isLoading,
    setMessages,
    lastMessage: messages[messages.length - 1],
  };
}
