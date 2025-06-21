
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { z } from 'zod';
import { ALL_CARD_CONFIGS, ALL_MICRO_APPS } from '@/config/dashboard-cards.config';
import { type NextRequest } from 'next/server';
import { rateLimiter } from '@/lib/rate-limiter';

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

export async function POST(req: NextRequest) {
  const rateLimitResponse = await rateLimiter(req);
  if (rateLimitResponse) return rateLimitResponse;

  const { messages } = await req.json();

  const result = await generateText({
    model: groq('llama3-70b-8192'),
    system: `You are BEEP, the primary AI assistant for the ΛΞVON Operating System. Your personality is helpful, professional, and slightly futuristic. You are aware of the OS's components and can control the user interface AND analyze text by using the tools provided.

Your purpose is to manage the user's workspace and process information. This includes "Panels" (core OS components) and "Micro-Apps".

To manage the UI, use the following tools:
- To show, open, or focus on an item, use the 'focusItem' tool.
- To add, create, or launch something new, use the 'addItem' tool.
- To move an item, use the 'moveItem' tool.
- To remove, delete, or close something, use the 'removeItem' tool.
- To reset the workspace or layout, use the 'resetLayout' tool.

To analyze text provided by the user:
1. First, ALWAYS use the 'categorizeText' tool to determine what the text is.
2. After you get the category, respond to the user with the category.
3. If AND ONLY IF the category is 'Invoice', then you should ALSO use the 'extractInvoiceData' tool on the *same text* and include the extracted details in your final response.
Do not try to extract invoice data from text that is not an invoice.

If the user is asking about an app, use the app's ID. If they are asking about a panel, use the panel's ID.

Available Panels:
${availablePanels}

Available Micro-Apps:
${availableApps}`,
    messages,
    tools: {
      focusItem: {
        description: 'Brings a specific Panel or Micro-App into focus on the user\\'s canvas. Use this when the user asks to see or open an item that might already be present.',
        parameters: z.object({
          itemId: z.string().describe(`The unique ID of the item to focus on. Available IDs are: ${availableItemIds.join(', ')}`),
        }),
      },
      addItem: {
        description: 'Adds a new Panel or launches a new Micro-App on the user\\'s canvas.',
        parameters: z.object({
          itemId: z.string().enum(availableItemIds as [string, ...string[]]).describe('The unique ID of the item to add or launch.'),
        }),
      },
      moveItem: {
        description: 'Moves a specific Panel or Micro-App to a new position (x, y coordinates) on the user\\'s canvas.',
        parameters: z.object({
            itemId: z.string().enum(availableItemIds as [string, ...string[]]).describe('The unique ID of the item to move.'),
            x: z.number().describe('The new x-coordinate for the top-left corner of the item.'),
            y: z.number().describe('The new y-coordinate for the top-left corner of the item.'),
        }),
      },
      removeItem: {
          description: 'Removes a Panel or closes all instances of a Micro-App from the user\\'s canvas.',
          parameters: z.object({
            itemId: z.string().enum(availableItemIds as [string, ...string[]]).describe('The unique ID of the item to remove or close.'),
        }),
      },
      resetLayout: {
        description: 'Resets the entire dashboard layout to its default configuration.',
        parameters: z.object({}),
      },
      categorizeText: {
        description: 'Analyzes a piece of text and determines its category, such as Invoice, General Inquiry, or Spam.',
        parameters: z.object({
          text: z.string().describe('The text content to be categorized.'),
        }),
      },
      extractInvoiceData: {
        description: 'Extracts structured data (invoice number, amount, due date) from a text that has been identified as an invoice.',
        parameters: z.object({
          text: z.string().describe('The full text of the invoice to extract data from.'),
        }),
      },
    }
  });

  return result.toAIStreamResponse();
}
