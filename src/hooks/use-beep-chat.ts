
import { useChat } from 'ai/react';
import eventBus from '@/lib/event-bus';
import { ALL_MICRO_APPS, ALL_CARD_CONFIGS } from '@/config/dashboard-cards.config';
import type { TextCategory, InvoiceData } from '@/lib/ai-schemas';

export function useBeepChat() {
    const { messages, append, isLoading, setMessages, lastMessage } = useChat({
    api: '/api/ai/chat',
    onToolCall: async (toolCalls) => {
      
      const toolCallResults = await Promise.all(toolCalls.map(async (toolCall) => {
        const { toolName, args } = toolCall;
        let result: any;
        const taskName = `BEEP: ${toolName}`;
        let status: 'success' | 'failure' = 'success';
        let details = `Tool ${toolName} executed successfully.`;

        try {
          switch (toolName) {
              case 'focusItem': {
                  const { itemId } = args;
                  eventBus.emit('panel:focus', itemId);
                  details = `Focused on item: ${itemId}`;
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
                      eventBus.emit('panel:add', itemId);
                      const card = ALL_CARD_CONFIGS.find(c => c.id === itemId);
                      details = `Added Panel "${card?.title || itemId}".`;
                  }
                  result = { success: true, message: details };
                  break;
              }
              case 'moveItem': {
                  const { itemId, x, y } = args as { itemId: string; x: number; y: number; };
                  eventBus.emit('item:move', { itemId, x, y });
                  details = `Moved item "${itemId}" to position (${x}, ${y}).`;
                  result = { success: true, message: details };
                  break;
              }
              case 'removeItem': {
                  const { itemId } = args;
                  const isApp = ALL_MICRO_APPS.some(app => app.id === itemId);
                  if (isApp) {
                      eventBus.emit('app:closeAll', itemId);
                      details = `Closing all instances of "${itemId}".`;
                  } else {
                      eventBus.emit('panel:remove', itemId);
                      details = `Removed Panel "${itemId}".`;
                  }
                  result = { success: true, message: details };
                  break;
              }
              case 'resetLayout': {
                  eventBus.emit('layout:reset');
                  details = `The workspace layout has been reset to default.`;
                  result = { success: true, message: details };
                  break;
              }
              case 'categorizeText': {
                  const { text } = args as { text: string };
                  const response = await fetch('/api/ai/categorize-text', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text }),
                  });
                  if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Categorization API failed');
                  }
                  result = await response.json() as TextCategory;
                  details = `Categorized text as: ${result.category}`;
                  break;
              }
              case 'extractInvoiceData': {
                  const { text } = args as { text: string };
                  const response = await fetch('/api/ai/extract-invoice-data', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text }),
                  });
                  if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Extraction API failed');
                  }
                  result = await response.json() as InvoiceData;
                  details = result.summary;
                  break;
              }
              default:
                  throw new Error(`Unhandled tool call: ${toolName}`);
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
