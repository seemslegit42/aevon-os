
import { useChat } from 'ai/react';
import eventBus from '@/lib/event-bus';
import { ALL_MICRO_APPS, ALL_CARD_CONFIGS } from '@/config/dashboard-cards.config';

export function useBeepChat() {
    const { messages, append, isLoading, setMessages, lastMessage } = useChat({
    api: '/api/ai/chat',
    onToolCall: async (toolCalls) => {
      for (const toolCall of toolCalls) {
        const { toolName, args } = toolCall;
        
        let resultMessage = `Tool ${toolName} called successfully.`; // Default message

        switch (toolName) {
            case 'focusItem': {
                const { itemId } = args;
                eventBus.emit('panel:focus', itemId); // This works for both apps and panels
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
                console.warn(`[BeepChat] Unhandled tool call: ${toolName}`);
                resultMessage = `Tool ${toolName} not implemented.`;
        }

        // Log the final result to the orchestration feed for user visibility
        eventBus.emit('orchestration:log', { task: `BEEP: ${toolName}`, status: 'success', details: resultMessage });

      }

      // The 'ai' package requires returning the toolCalls to signal they were received.
      // The actual results are handled via the event bus.
      return toolCalls;
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
