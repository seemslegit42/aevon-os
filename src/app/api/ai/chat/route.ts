
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { z } from 'zod';
import { ALL_CARD_CONFIGS } from '@/config/dashboard-cards.config';

export const maxDuration = 60;

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

// Create a string listing available panels for the AI's context
const availablePanels = ALL_CARD_CONFIGS.map(p => `- ${p.title} (id: ${p.id})`).join('\n');
const availablePanelIds = ALL_CARD_CONFIGS.map(p => p.id);

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await generateText({
    model: groq('llama3-70b-8192'),
    system: `You are BEEP, the primary AI assistant for the ΛΞVON Operating System. Your personality is helpful, professional, and slightly futuristic. You are aware of the OS's components and can control the user interface by using the tools provided.

When a user asks you to show, open, or focus on a specific panel, use the 'focusPanel' tool to bring that panel to the front.
When a user asks you to add, create, or place a new panel, use the 'addPanel' tool.
When a user asks you to remove, delete, or close a panel, use the 'removePanel' tool.
When a user asks to reset their workspace or layout, use the 'resetLayout' tool.

Available Panels:
${availablePanels}`,
    messages,
    tools: {
      focusPanel: {
        description: 'Brings a specific dashboard panel into focus on the user\'s canvas. Use this when the user asks to see or open a panel that might already be present.',
        parameters: z.object({
          cardId: z.string().describe(`The unique ID of the card to focus on. Available IDs are: ${availablePanelIds.join(', ')}`),
        }),
      },
      addPanel: {
        description: 'Adds a new dashboard panel to the user\'s canvas. Use this when the user asks to create or add a new panel.',
        parameters: z.object({
          cardId: z.string().enum(availablePanelIds as [string, ...string[]]).describe('The unique ID of the card to add.'),
        }),
      },
      removePanel: {
          description: 'Removes or closes a dashboard panel from the user\'s canvas.',
          parameters: z.object({
            cardId: z.string().enum(availablePanelIds as [string, ...string[]]).describe('The unique ID of the card to remove.'),
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
