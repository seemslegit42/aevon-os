
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
    const openItemsSummary = layoutItems.map(item => {
        const config = item.type === 'card'
            ? ALL_CARD_CONFIGS.find(c => c.id === item.cardId)
            : ALL_MICRO_APPS.find(a => a.id === item.appId);
        return config ? `- ${config.title}` : `- Unknown Item (ID: ${item.id})`;
    }).join('\n');
    
    const allAvailableItems = [...ALL_CARD_CONFIGS.map(c => c.title), ...ALL_MICRO_APPS.map(a => a.title)].join(', ');

    try {
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
        return insights;
    } catch (error) {
        console.error("Error in generateInsights server action:", error);
        throw new Error("The AI model failed to generate insights.");
    }
}
