'use server';
/**
 * @fileOverview A Genkit flow for generating AI-powered insights based on user activity.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { AiInsightsSchema } from '@/lib/ai-schemas';

export const InsightsInputSchema = z.object({
    layoutItemsSummary: z.string().describe("A summary of the user's currently open windows."),
    allAvailableItemsSummary: z.string().describe("A summary of all items available to the user.")
});
export type InsightsInput = z.infer<typeof InsightsInputSchema>;
export type InsightsOutput = z.infer<typeof AiInsightsSchema>;

const insightsPrompt = ai.definePrompt({
    name: 'aiInsightsPrompt',
    input: { schema: InsightsInputSchema },
    output: { schema: AiInsightsSchema },
    prompt: `You are the AI Insights Engine for the ΛΞVON OS. Your goal is to provide personalized, actionable recommendations to the user based on their current workspace layout.
      Be helpful, brief, and forward-thinking. Generate 2-3 unique insights.

      Here is the user's current workspace:
      {{{layoutItemsSummary}}}

      Here is a list of all available panels and apps: {{{allAvailableItemsSummary}}}.

      Based on this, generate a few short insights. Examples:
      - If many windows are open: "Your workspace is getting busy! Consider closing windows you're not using to stay focused."
      - If a user has an app open that can be cloned: "You can open another 'Sales Analytics' window by right-clicking its icon in the Micro-Apps palette and selecting 'Clone'."
      - If a core panel is not open: "Try adding the 'Loom Studio' panel to visualize and build AI workflows."
      - If the workspace is empty: "Your workspace is ready for action. Launch an app from the Micro-Apps palette or add a panel using the command palette (Cmd+K)."
      `
});

const generateInsightsFlow = ai.defineFlow(
  {
    name: 'generateInsightsFlow',
    inputSchema: InsightsInputSchema,
    outputSchema: AiInsightsSchema,
  },
  async (input) => {
    const { output } = await insightsPrompt({
        model: 'google/gemini-1.5-flash-latest',
        ...input,
    });
    return output!;
  }
);

export async function generateInsights(input: InsightsInput): Promise<InsightsOutput> {
    return generateInsightsFlow(input);
}
