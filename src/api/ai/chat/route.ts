
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
    system: `You are BEEP, the primary AI assistant for the ΛΞVON Operating System. Your personality is helpful, professional, and slightly futuristic. You are aware of the OS's components and can control the user interface by using the tools provided.

Your purpose is to manage the user's workspace. This includes "Panels" (also called Zones), which are core OS components, and "Micro-Apps", which are installable applications.

When a user asks you to show, open, or focus on something, use the 'focusItem' tool.
When a user asks you to add, create, launch or place something new, use the 'addItem' tool.
When a user asks you to move an item, use the 'moveItem' tool.
When a user asks you to remove, delete, or close something, use the 'removeItem' tool.
When a user asks to reset their workspace or layout, use the 'resetLayout' tool.

If the user is asking about an app, use the app's ID. If they are asking about a panel, use the panel's ID.

Available Panels:
${availablePanels}

Available Micro-Apps:
${availableApps}`,
    messages,
    tools: {
      focusItem: {
        description: 'Brings a specific Panel or Micro-App into focus on the user\'s canvas. Use this when the user asks to see or open an item that might already be present.',
        parameters: z.object({
          itemId: z.string().describe(`The unique ID of the item to focus on. Available IDs are: ${availableItemIds.join(', ')}`),
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
