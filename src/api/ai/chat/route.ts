
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { z } from 'zod';
import { ALL_CARD_CONFIGS, ALL_MICRO_APPS } from '@/config/dashboard-cards.config';

export const maxDuration = 60;

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

// Create strings listing available items for the AI's context
const availablePanels = ALL_CARD_CONFIGS.map(p => `- ${p.title} (id: ${p.id})`).join('\n');
const availableApps = ALL_MICRO_APPS.map(a => `- ${a.title} (id: ${a.id})`).join('\n');

// Combine IDs for tool validation
const availableItemIds = [
    ...ALL_CARD_CONFIGS.map(p => p.id),
    ...ALL_MICRO_APPS.map(a => a.id)
];

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await generateText({
    model: groq('llama3-70b-8192'),
    system: `You are BEEP, the AI assistant for the ΛΞVON Operating System. You are helpful, professional, and concise.
Your purpose is to help the user manage their workspace by controlling the UI via function calls.

The user's workspace contains "Panels" (core OS components) and "Micro-Apps" (installable applications).

- To show, open, or focus on an item, use the 'focusItem' tool.
- To add, create, or launch a new item, use the 'addItem' tool.
- To move an item, use the 'moveItem' tool.
- To remove, delete, or close an item, use the 'removeItem' tool.
- To reset the workspace layout, use the 'resetLayout' tool.

Always use the item's ID for any action.

Available Panels:
${availablePanels}

Available Micro-Apps:
${availableApps}`,
    messages,
    tools: {
      focusItem: {
        description: 'Brings a specific Panel or Micro-App into focus on the user\'s canvas. Use this when the user asks to see or open an item.',
        parameters: z.object({
          itemId: z.string().describe(`The unique ID of the item to focus on. Available IDs: ${availableItemIds.join(', ')}`),
        }),
      },
      addItem: {
        description: 'Adds a new Panel or launches a new Micro-App on the user\'s canvas.',
        parameters: z.object({
          itemId: z.string().enum(availableItemIds as [string, ...string[]]).describe('The unique ID of the item to add or launch.'),
        }),
      },
      moveItem: {
        description: 'Moves a specific Panel or Micro-App to a new position (x, y coordinates) on the user\'s canvas.',
        parameters: z.object({
            itemId: z.string().enum(availableItemIds as [string, ...string[]]).describe('The unique ID of the item to move.'),
            x: z.number().describe('The new x-coordinate for the top-left corner of the item.'),
            y: z.number().describe('The new y-coordinate for the top-left corner of the item.'),
        }),
      },
      removeItem: {
          description: 'Removes a Panel or closes all instances of a Micro-App from the user\'s canvas.',
          parameters: z.object({
            itemId: z.string().enum(availableItemIds as [string, ...string[]]).describe('The unique ID of the item to remove or close.'),
        }),
      },
      resetLayout: {
        description: 'Resets the entire dashboard layout to its default configuration.',
        parameters: z.object({}),
      },
    }
  });

  return result.toAIStreamResponse();
}
