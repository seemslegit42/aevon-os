
'use server';

import { generateObject } from 'ai';
import { google } from '@/lib/ai/groq';
import { AiInsightsSchema, type AiInsights } from '@/lib/ai-schemas';
import type { LayoutItem } from '@/types/dashboard';
import { ALL_CARD_CONFIGS, ALL_MICRO_APPS } from '@/config/dashboard-cards.config';

/**
 * A server action to generate workspace insights using a dedicated AI model.
 * @param layoutItems - The current layout of the user's dashboard.
 * @returns A promise that resolves to the structured AI insights.
 */
export async function generateInsights(layoutItems: LayoutItem[]): Promise<AiInsights> {
    const openWindowsSummary = layoutItems.length > 0
    ? layoutItems.map(item => {
        const config = item.type === 'card'
            ? ALL_CARD_CONFIGS.find(c => c.id === item.cardId)
            : ALL_MICRO_APPS.find(a => a.id === item.appId);
        return `- ${config?.title || 'Unknown Item'} (type: ${item.type}, ${item.type === 'card' ? `id: ${item.cardId}` : `appId: ${item.appId}`}, instanceId: ${item.id})`;
    }).join('\n')
    : 'The user has an empty workspace.';
    
    const allAvailableItems = [
        ...ALL_CARD_CONFIGS.map(c => `- ${c.title} (id: ${c.id})`),
        ...ALL_MICRO_APPS.map(a => `- ${a.title} (id: ${a.id})`)
    ].join('\n');

    try {
        const { object: insights } = await generateObject({
            model: google('gemini-1.5-flash-latest'),
            schema: AiInsightsSchema,
            prompt: `You are an AI assistant for the AEVON OS, tasked with providing contextual insights to help the user optimize their workflow.

Here are all items available in the OS. You can suggest adding them using the 'addItem' tool with their static 'id'.
---
${allAvailableItems}
---

Here is a summary of the user's current workspace layout. You can suggest focusing on an open item using the 'focusItem' tool with its unique 'instanceId'.
---
${openWindowsSummary}
---

Based on the user's current layout, provide a maximum of 3 short, actionable insights or recommendations.
For each insight, you may optionally suggest a corresponding action.
- If you suggest adding an item, use the 'addItem' tool and its static 'id'.
- If you suggest focusing on an already open item, use the 'focusItem' tool and its 'instanceId'.
- For example, if they have sales data open, you might suggest launching the 'Sales Analytics' app ('addItem' with id 'app-analytics').
- If their workspace is empty, suggest adding a few common starting panels.
- If an item is already open, do not suggest adding it again; suggest focusing it instead.
- The 'displayText' for the action button should be short and clear, like "Launch App" or "Focus Window".`
        });
        return insights;
    } catch (error) {
        console.error("Error in generateInsights server action:", error);
        throw new Error("The AI model failed to generate insights.");
    }
}
