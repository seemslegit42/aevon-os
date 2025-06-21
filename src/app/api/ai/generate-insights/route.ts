
import { type NextRequest } from 'next/server';
import { rateLimiter } from '@/lib/rate-limiter';
import { ALL_CARD_CONFIGS, ALL_MICRO_APPS } from '@/config/dashboard-cards.config';
import { google } from '@/lib/ai/groq';
import { generateObject } from 'ai';
import { AiInsightsSchema } from '@/lib/ai-schemas';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const rateLimitResponse = await rateLimiter(req);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { layoutItems } = await req.json();

    if (!layoutItems || !Array.isArray(layoutItems)) {
      return new Response(JSON.stringify({ error: 'Layout items are required.' }), { status: 400 });
    }

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
        model: google('gemini-1.5-flash-latest'),
        schema: AiInsightsSchema,
        prompt: `You are an AI assistant for the AEVON OS, tasked with providing contextual insights to help the user optimize their workflow.

Here is a list of all items available in the OS:
${allAvailableItems}

Here is a summary of the user's current workspace layout (the panels and apps they have open):
---
${openItemsSummary || 'The user has an empty workspace.'}
---

Based on the user's current layout, provide a maximum of 3 short, actionable insights or recommendations. For example, if they have sales data open, you might suggest opening a related analytics app. If their workspace is empty, suggest some common starting panels.`
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
