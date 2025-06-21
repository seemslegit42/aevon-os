
import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import { AiInsightsSchema } from '@/lib/ai-schemas';
import { ALL_CARD_CONFIGS, ALL_MICRO_APPS } from '@/config/dashboard-cards.config';

export const maxDuration = 60;

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { layoutItems } = await req.json();

    if (!layoutItems || !Array.isArray(layoutItems)) {
      return new Response(JSON.stringify({ error: 'Layout items are required.' }), { status: 400 });
    }

    // Process layout items into a readable summary for the prompt
    const openItemsSummary = layoutItems.map(item => {
        if (item.type === 'card') {
            const card = ALL_CARD_CONFIGS.find(c => c.id === item.cardId);
            return card ? `- Panel: ${card.title}` : `- Unknown Panel (ID: ${item.cardId})`;
        } else { // 'app'
            const app = ALL_MICRO_APPS.find(a => a.id === item.appId);
            return app ? `- Micro-App: ${app.title}`: `- Unknown App (ID: ${item.appId})`;
        }
    }).join('\n');
    
    const allAvailableItems = [...ALL_CARD_CONFIGS.map(c => c.title), ...ALL_MICRO_APPS.map(a => a.title)].join(', ');

    const { object: insights } = await generateObject({
      model: groq('llama3-70b-8192'),
      schema: AiInsightsSchema,
      prompt: `You are the AI Insights Engine for the ΛΞVON OS. Your goal is to provide personalized, actionable recommendations to the user based on their current workspace layout.
      Be helpful, brief, and forward-thinking. Generate 2-3 unique insights.

      Here is the user's current workspace:
      ${openItemsSummary || 'The user has an empty workspace.'}

      Here is a list of all available panels and apps: ${allAvailableItems}.

      Based on this, generate a few short insights. Examples:
      - If many windows are open: "Your workspace is getting busy! Consider closing windows you're not using to stay focused."
      - If a user has an app open that can be cloned: "You can open another 'Sales Analytics' window by right-clicking its icon in the Micro-Apps palette and selecting 'Clone'."
      - If a core panel is not open: "Try adding the 'Loom Studio' panel to visualize and build AI workflows."
      - If the workspace is empty: "Your workspace is ready for action. Launch an app from the Micro-Apps palette or add a panel using the command palette (Cmd+K)."
      `,
    });

    return Response.json(insights);

  } catch (error) {
    console.error('Error in insights generation API:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}
