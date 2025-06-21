
'use server';

import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { AppDescriptionInputSchema, type AppDescriptionInput } from '@/lib/ai-schemas';
import { z } from 'zod';

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

const DescriptionOutputSchema = z.object({
  description: z.string().describe('The generated marketplace description for the application.'),
});

/**
 * Generates a compelling marketplace description for a micro-app.
 * @param input The details of the application.
 * @returns The generated description string.
 * @throws Throws an error if the generation fails.
 */
export async function generateAppDescriptionAction(input: AppDescriptionInput): Promise<{ description: string }> {
    const validatedInput = AppDescriptionInputSchema.parse(input);

    const prompt = `Act as an expert marketing and product copywriter. Generate a compelling, engaging, and concise marketplace description for a new micro-application for the ΛΞVON OS.

The description should be market-ready, highlighting the primary benefits for the specified target audience in a punchy and professional tone.

App Details:
- App Name: ${validatedInput.microAppName}
- Core Functionality: ${validatedInput.microAppFunctionality}
- Target Audience: ${validatedInput.targetAudience}
- Key Features: ${validatedInput.keyFeatures}`;

    const { object } = await generateObject({
        model: groq('llama3-70b-8192'),
        schema: DescriptionOutputSchema,
        prompt,
    });

    return object;
}
