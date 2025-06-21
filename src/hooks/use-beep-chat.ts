
import { useChat } from 'ai/react';
import eventBus from '@/lib/event-bus';
import { ALL_MICRO_APPS, ALL_CARD_CONFIGS } from '@/config/dashboard-cards.config';

export function useBeepChat() {
    const { messages, append, isLoading, setMessages, lastMessage } = useChat({
    api: '/api/ai/chat',
    onToolCall: async (toolCalls) => {
      // Filter for client-side tools only. Server tools are handled by the API route.
      const clientToolCalls = toolCalls.filter(tc => 
        ['focusItem', 'addItem', 'moveItem', 'removeItem', 'resetLayout', 'closeAllInstancesOfApp'].includes(tc.toolName)
      );
        
      if (clientToolCalls.length === 0) {
        return;
      }

      const toolCallResults = await Promise.all(clientToolCalls.map(async (toolCall) => {
        const { toolName, args } = toolCall;
        let result: any;
        const taskName = `BEEP: ${toolName}`;
        let status: 'success' | 'failure' = 'success';
        let details = `Tool ${toolName} executed successfully.`;

        try {
          switch (toolName) {
              case 'focusItem': {
                  const { instanceId } = args;
                  eventBus.emit('panel:focus', instanceId as string);
                  details = `Focused on item: ${instanceId}`;
                  result = { success: true, message: details };
                  break;
              }
              case 'addItem': {
                  const { itemId } = args;
                  const appToAdd = ALL_MICRO_APPS.find(app => app.id === itemId);
                  if (appToAdd) {
                      eventBus.emit('app:launch', appToAdd);
                      details = `Launched Micro-App "${appToAdd.title}".`;
                  } else {
                      eventBus.emit('panel:add', itemId as string);
                      const card = ALL_CARD_CONFIGS.find(c => c.id === itemId);
                      details = `Added Panel "${card?.title || itemId}".`;
                  }
                  result = { success: true, message: details };
                  break;
              }
              case 'moveItem': {
                  const { instanceId, x, y } = args as { instanceId: string; x: number; y: number; };
                  eventBus.emit('item:move', { itemId: instanceId, x, y });
                  details = `Moved item "${instanceId}" to position (${x}, ${y}).`;
                  result = { success: true, message: details };
                  break;
              }
              case 'removeItem': {
                  const { instanceId } = args as { instanceId: string };
                  eventBus.emit('panel:remove', instanceId);
                  details = `Removed window "${instanceId}".`;
                  result = { success: true, message: details };
                  break;
              }
              case 'closeAllInstancesOfApp': {
                  const { appId } = args as { appId: string };
                  const app = ALL_MICRO_APPS.find(a => a.id === appId);
                  eventBus.emit('app:closeAll', appId);
                  details = `Closing all instances of "${app?.title || appId}".`;
                  result = { success: true, message: details };
                  break;
              }
              case 'resetLayout': {
                  eventBus.emit('layout:reset');
                  details = `The workspace layout has been reset to default.`;
                  result = { success: true, message: details };
                  break;
              }
              default:
                  throw new Error(`Unhandled client-side tool call: ${toolName}`);
          }
        } catch (error: any) {
          result = { error: error.message };
          status = 'failure';
          details = error.message;
        }

        eventBus.emit('orchestration:log', { task: taskName, status, details });
        return { ...toolCall, result };
      }));
      
      return toolCallResults;
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
