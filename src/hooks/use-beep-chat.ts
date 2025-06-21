
import { useChat } from 'ai/react';
import eventBus from '@/lib/event-bus';
import { ALL_MICRO_APPS, ALL_CARD_CONFIGS } from '@/config/dashboard-cards.config';

export function useBeepChat() {
    const { messages, append, isLoading, setMessages } = useChat({
    api: '/api/ai/chat',
    experimental_onToolCall: async (toolCalls, appendToolCallMessage) => {
      let hasHandledTool = false;

      for (const toolCall of toolCalls) {
        let resultMessage = `Tool ${toolCall.toolName} called successfully.`;
        hasHandledTool = true;
        const { toolName, args } = toolCall;

        switch (toolName) {
            case 'focusItem': {
                const { itemId } = args;
                const isApp = ALL_MICRO_APPS.some(app => app.id === itemId);
                if (isApp) {
                    eventBus.emit('app:focusLatest', itemId);
                } else {
                    eventBus.emit('panel:focus', itemId);
                }
                resultMessage = `Item "${itemId}" has been brought into focus.`;
                break;
            }
            case 'addItem': {
                const { itemId } = args;
                const appToAdd = ALL_MICRO_APPS.find(app => app.id === itemId);
                if (appToAdd) {
                    eventBus.emit('app:launch', appToAdd);
                    resultMessage = `Launched Micro-App "${appToAdd.title}".`;
                } else {
                    eventBus.emit('panel:add', itemId);
                    const card = ALL_CARD_CONFIGS.find(c => c.id === itemId);
                    resultMessage = `Added Panel "${card?.title || itemId}".`;
                }
                break;
            }
            case 'moveItem': {
                const { itemId, x, y } = args as { itemId: string; x: number; y: number; };
                eventBus.emit('item:move', { itemId, x, y });
                resultMessage = `Moved item "${itemId}" to position (${x}, ${y}).`;
                break;
            }
            case 'removeItem': {
                const { itemId } = args;
                const isApp = ALL_MICRO_APPS.some(app => app.id === itemId);
                if (isApp) {
                    eventBus.emit('app:closeAll', itemId);
                    resultMessage = `Closing all instances of "${itemId}".`;
                } else {
                    eventBus.emit('panel:remove', itemId);
                    resultMessage = `Removed Panel "${itemId}".`;
                }
                break;
            }
            case 'resetLayout': {
                eventBus.emit('layout:reset');
                resultMessage = `The workspace layout has been reset to default.`;
                break;
            }
            default:
                resultMessage = `Tool ${toolName} not implemented.`;
        }

        // Pass a structured object as a string for the frontend to parse and render
        const toolExecutionResult = {
            toolName,
            args,
            message: resultMessage,
        };

        appendToolCallMessage({
            toolCallId: toolCall.toolCallId,
            toolName: toolName,
            result: JSON.stringify(toolExecutionResult),
        });
      }
      return hasHandledTool;
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
