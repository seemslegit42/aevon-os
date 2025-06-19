// src/ai/flows/generate-personalized-briefings.ts
'use server';
/**
 * @fileOverview An AI agent for generating personalized briefings for users.
 *
 * - generatePersonalizedBriefing - A function that generates a personalized briefing.
 * - GeneratePersonalizedBriefingInput - The input type for the generatePersonalizedBriefing function.
 * - GeneratePersonalizedBriefingOutput - The return type for the generatePersonalizedBriefing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedBriefingInputSchema = z.object({
  userName: z.string().describe('The name of the user for whom the briefing is being generated.'),
  operationalMetrics: z.string().describe('Key operational metrics to include in the briefing.'),
  relevantInformation: z.string().describe('Relevant information to include in the briefing.'),
});
export type GeneratePersonalizedBriefingInput = z.infer<typeof GeneratePersonalizedBriefingInputSchema>;

const GeneratePersonalizedBriefingOutputSchema = z.object({
  briefing: z.string().describe('The personalized briefing for the user.'),
});
export type GeneratePersonalizedBriefingOutput = z.infer<typeof GeneratePersonalizedBriefingOutputSchema>;

export async function generatePersonalizedBriefing(input: GeneratePersonalizedBriefingInput): Promise<GeneratePersonalizedBriefingOutput> {
  return generatePersonalizedBriefingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedBriefingPrompt',
  input: {schema: GeneratePersonalizedBriefingInputSchema},
  output: {schema: GeneratePersonalizedBriefingOutputSchema},
  prompt: `You are an AI assistant tasked with generating personalized briefings for users.

  Your goal is to summarize key operational metrics and relevant information to keep the user informed.

  User Name: {{{userName}}}
  Operational Metrics: {{{operationalMetrics}}}
  Relevant Information: {{{relevantInformation}}}

  Please provide a concise and informative briefing, tailored to the user's needs.
  `,
});

const generatePersonalizedBriefingFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedBriefingFlow',
    inputSchema: GeneratePersonalizedBriefingInputSchema,
    outputSchema: GeneratePersonalizedBriefingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
