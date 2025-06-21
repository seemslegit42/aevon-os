'use server';
/**
 * @fileOverview A Genkit flow for generating various types of written content.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { ContentGenerationSchema } from '@/lib/ai-schemas';

export const ContentCreationInputSchema = z.object({
    topic: z.string(),
    contentType: z.string(),
    tone: z.string(),
});
export type ContentCreationInput = z.infer<typeof ContentCreationInputSchema>;
export type ContentCreationOutput = z.infer<typeof ContentGenerationSchema>;

const contentGenerationPrompt = ai.definePrompt({
    name: 'contentGenerationPrompt',
    input: { schema: ContentCreationInputSchema },
    output: { schema: ContentGenerationSchema },
    prompt: `You are an expert content creator specializing in writing for business audiences. Your task is to generate content based on the user's request.
    
    Topic: {{{topic}}}
    Content Type: {{{contentType}}}
    Tone of Voice: {{{tone}}}

    Generate a compelling piece of content based on these parameters.
    - If the content type is "Blog Post", the body should be well-structured with markdown for headings, lists, and bold text. It should be at least 3 paragraphs long.
    - If the content type is "Tweet", the body should be concise, under 280 characters, and include relevant hashtags.
    - If the content type is "Marketing Email", the body should have a clear call-to-action and a professional closing.
    
    Adhere strictly to the requested tone.`
});

const generateContentFlow = ai.defineFlow(
  {
    name: 'generateContentFlow',
    inputSchema: ContentCreationInputSchema,
    outputSchema: ContentGenerationSchema,
  },
  async (input) => {
    const { output } = await contentGenerationPrompt({
        model: 'google/gemini-1.5-flash-latest',
        ...input
    });
    return output!;
  }
);

export async function generateContent(input: ContentCreationInput): Promise<ContentCreationOutput> {
    return generateContentFlow(input);
}
