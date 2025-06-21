
import { type NextRequest } from 'next/server';
import { rateLimiter } from '@/lib/rate-limiter';
import { ALL_CARD_CONFIGS, ALL_MICRO_APPS } from '@/config/dashboard-cards.config';
import { generateInsights } from '@/ai/flows/generate-insights-flow';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const rateLimitResponse = await rateLimiter(req);
  if (rateLimitResponse) return rateLimitResponse;

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

    const insights = await generateInsights({ 
        layoutItemsSummary: openItemsSummary || 'The user has an empty workspace.',
        allAvailableItemsSummary: allAvailableItems,
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
